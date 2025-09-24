import React, { useState, useEffect, forwardRef } from 'react';
import { Link } from 'react-router-dom';

const FormCards = forwardRef((props, ref) => {
  const [forms, setForms] = useState([]);

  // fetch details from backend
  const fetchDetails = async () => {
    const response = await fetch("https://quickresize-m1au.onrender.com/details");
    const data = await response.json();

    // convert object -> array for easy mapping
    const arr = Object.entries(data).map(([key, value]) => ({
      id: key,
      name: value.name,
      logo: `https://quickresize-m1au.onrender.com/${value.logo}`,
      route: value.route,
    }));
    setForms(arr);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div ref={ref}>
      <h1 className="font-bold text-2xl text-center mt-5">
        All Forms Resizers
      </h1>
      <div className="grid justify-items-center items-center grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 p-4">
        {forms.map((form) => (
          <Link to={`/resize/${form.id}`} key={form.id}>
            <div
              className="card w-50 flex gap-2 flex-col justify-center items-center"
              style={{
                border: "2px solid black",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <img src={form.logo} alt={form.name} className="w-50 h-50" />
              <h1 className="font-bold text-{12px}">{form.name}</h1>
              <button
                className="text-white cursor-pointer px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
                style={{
                  background:
                    "linear-gradient(to right, white -123%, black 74%)",
                }}
              >
                Resize
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

export default FormCards;
