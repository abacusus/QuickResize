import io
import base64
from PIL import Image
from config import form_configs


def process_image(image_bytes, config):
    """Resize and process image according to config."""
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

        def save_jpeg_with_quality(buffer, q, dpi_val):
            buffer.seek(0)
            buffer.truncate()
            resized_img.save(buffer, format="jpeg", quality=q, dpi=(dpi_val, dpi_val))

        save_jpeg_with_quality(output_buffer, quality, dpi_value)
        final_size_kb = len(output_buffer.getvalue()) / 1024

        # Try to meet minimum KB
        if "minKB" in config and final_size_kb < config["minKB"]:
            while quality < max_quality:
                quality += 5
                save_jpeg_with_quality(output_buffer, quality, dpi_value)
                final_size_kb = len(output_buffer.getvalue()) / 1024
                if final_size_kb >= config["minKB"]:
                    break

        # Increase DPI if still too small
        if "minKB" in config and final_size_kb < config["minKB"]:
            while dpi_value < 1200:
                dpi_value += 100
                save_jpeg_with_quality(output_buffer, quality, dpi_value)
                final_size_kb = len(output_buffer.getvalue()) / 1024
                if final_size_kb >= config["minKB"]:
                    break

    elif config["format"] == "png":
        resized_img.save(output_buffer, format="png", compress_level=9, dpi=dpi_tuple)
    else:
        raise ValueError(f"Unsupported format: {config['format']}")

    # Validation
    final_size_kb = len(output_buffer.getvalue()) / 1024
    if "maxKB" in config and final_size_kb > config["maxKB"]:
        raise ValueError(
            f"File exceeds {config['maxKB']}KB. Final: {final_size_kb:.0f}KB."
        )
    if "minKB" in config and final_size_kb < config["minKB"]:
        raise ValueError(
            f"File too small ({final_size_kb:.0f}KB). Min: {config['minKB']}KB."
        )

    output_buffer.seek(0)
    return output_buffer


def lambda_handler(event, context):
    """
    Main AWS Lambda handler.
    Expects:
    {
        "formType": "passport",
        "docType": "photo",
        "image_base64": "<base64-encoded image>"
    }
    Returns base64-encoded processed image.
    """
    try:
        form_type = event.get("formType")
        doc_type = event.get("docType")
        image_b64 = event.get("image_base64")

        if not all([form_type, doc_type, image_b64]):
            return {"statusCode": 400, "body": "Missing formType/docType/image_base64"}

        config = form_configs.get(form_type, {}).get(doc_type)
        if not config:
            return {"statusCode": 400, "body": "Invalid formType or docType"}

        image_bytes = base64.b64decode(image_b64)
        processed_buffer = process_image(image_bytes, config)

        output_b64 = base64.b64encode(processed_buffer.getvalue()).decode("utf-8")

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": {
                "message": "Image processed successfully",
                "format": config["format"],
                "image_base64": output_b64,
            },
        }

    except ValueError as e:
        return {"statusCode": 400, "body": str(e)}
    except Exception as e:
        return {"statusCode": 500, "body": f"Internal error: {str(e)}"}
