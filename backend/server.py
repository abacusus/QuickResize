# 1. Import necessary tools
from flask import Flask, request, send_file, jsonify,send_from_directory
from PIL import Image
import io
from flask_cors import CORS

# 2. Create the Flask web server application
app = Flask(__name__)

# 3. Define your image configurations with DPI
from config import form_configs

# 3.5 allow all cors

CORS(app)

# 4. Create the image processing function (CORRECTED VERSION)

def process_image(image_bytes, config):
    img = Image.open(io.BytesIO(image_bytes))
    resized_img = img.resize((config["width"], config["height"]))
    
    output_buffer = io.BytesIO()
    dpi_value = config.get("dpi", 300)
    dpi_tuple = (dpi_value, dpi_value)

    if config["format"] == "jpeg":
        if resized_img.mode in ("RGBA", "P"):
            resized_img = resized_img.convert("RGB")

        quality = 90
        min_quality = 10
        max_quality = 95

        def save_jpeg_with_quality(buffer, current_quality, dpi_val):
            buffer.seek(0)
            buffer.truncate()
            resized_img.save(buffer, format="jpeg", quality=current_quality, dpi=(dpi_val, dpi_val))

        # Initial save
        save_jpeg_with_quality(output_buffer, quality, dpi_value)
        final_size_kb = len(output_buffer.getvalue()) / 1024

        # Upscaling loop: try quality first
        if "minKB" in config and final_size_kb < config["minKB"]:
            while quality < max_quality:
                quality += 5
                save_jpeg_with_quality(output_buffer, quality, dpi_value)
                final_size_kb = len(output_buffer.getvalue()) / 1024
                if final_size_kb >= config["minKB"]:
                    break

        # If still too small, try increasing DPI
        if "minKB" in config and final_size_kb < config["minKB"]:
            while dpi_value < 1200:  # Arbitrary upper limit for DPI
                dpi_value += 100
                save_jpeg_with_quality(output_buffer, quality, dpi_value)
                final_size_kb = len(output_buffer.getvalue()) / 1024
                if final_size_kb >= config["minKB"]:
                    break

        # If still too small, pad image with white border
        if "minKB" in config and final_size_kb < config["minKB"]:
            pad = 20
            while final_size_kb < config["minKB"] and pad < 500:
                new_w = resized_img.width + pad
                new_h = resized_img.height + pad
                padded_img = Image.new("RGB", (new_w, new_h), (255, 255, 255))
                padded_img.paste(resized_img, ((pad // 2), (pad // 2)))
                resized_img = padded_img
                save_jpeg_with_quality(output_buffer, quality, dpi_value)
                final_size_kb = len(output_buffer.getvalue()) / 1024
                pad += 20

    elif config["format"] == "png":
        resized_img.save(
            output_buffer,
            format="png",
            compress_level=9,
            dpi=dpi_tuple
        )
    else:
        raise ValueError(f"Unsupported format specified in config: {config['format']}")

    # Final validation checks for all formats
    final_size_kb = len(output_buffer.getvalue()) / 1024
    if "maxKB" in config and final_size_kb > config["maxKB"]:
        raise ValueError(f"Could not reduce image size under {config['maxKB']}KB. Final size was {final_size_kb:.0f}KB.")

    if "minKB" in config and final_size_kb < config["minKB"]:
        raise ValueError(f"Image size is too small ({final_size_kb:.0f}KB). Minimum required is {config['minKB']}KB.")

    output_buffer.seek(0)
    return output_buffer


# 5. Define the main API route (No changes needed here)
@app.route("/resize/<formType>/<docType>", methods=["POST"])
def resize_image_api(formType, docType):
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded. Ensure the form field is named 'file'."}), 400

        # uploaded_file = request.files['file']
        # config = form_configs.get(formType, {}).get(docType)
        # if not config:
        #     return jsonify({"error": "Invalid form or document type provided."}), 400

        # Read the uploaded file as bytes (regardless of input format)
        image_bytes = uploaded_file.read()

        # Try to open the image to validate it's a supported image
        try:
            img = Image.open(io.BytesIO(image_bytes))
            img.verify()  # Just to check if it's a valid image
        except Exception:
            return jsonify({"error": "Uploaded file is not a valid image."}), 400

        # Now process the image (conversion handled inside process_image)
        processed_buffer = process_image(image_bytes, config)

        return send_file(
            processed_buffer,
            mimetype=f"image/{config['format']}",
            as_attachment=True,
            download_name=f"{formType}-{docType}.{config['format']}"
        )

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "A server error occurred while processing the image."}), 500
    
# Sending Form details
@app.route('/details', methods=['GET'])
def details():
    details_only = {key: value["details"] for key, value in form_configs.items()}
    return jsonify(details_only)

@app.route('/docType', methods=['GET'])
def docType():
    return jsonify(form_configs)

#sending images
@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory("images", filename)

# 6. Start the server when the script is run (No changes needed here)
if __name__ == "__main__":
    app.run(debug=True, port=5000)