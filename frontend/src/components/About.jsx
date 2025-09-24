// About.jsx
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-green-200 to-purple-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl max-w-3xl w-full p-8 text-center">
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          About Quick Resizer
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          <span className="font-semibold">Quick Resizer</span> is a simple and
          powerful tool designed to help you resize photos, signatures, and
          documents instantly. Whether you are applying for government jobs,
          school admissions, college forms, or any official application — our
          tool ensures your files meet the exact size and format requirements.
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          No more struggling with complicated software. With Quick Resizer,
          everything is fast, accurate, and hassle-free. Our goal is to save
          your time and make form-filling stress-free.
        </p>

       
      </div>
    </div>
  );
};

export default About;
