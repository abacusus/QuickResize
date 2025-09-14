import React from 'react'
import { useState, useEffect } from 'react';

const FormCards = () => {
  const [forms, setForms] = useState([])

  // fetch details from backend
  const fetchDetails = async () => {
    const response = await fetch("http://127.0.0.1:5000/details");
    const data = await response.json();

    // convert object -> array for easy mapping
    const arr = Object.entries(data).map(([key, value]) => ({
      id: key,
      name: value.name,  // map "Name" → name
      logo: `http://127.0.0.1:5000/${value.logo}` // prepend backend URL
    }));
    setForms(arr);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleResize = () =>{
    
  }

  return (
    <div>
      <div onClick={handleResize} className="Cards" style={{ display: "flex", gap: "20px" }}>
        {forms.map((form) => (
          <div key={form.id} className="card" style={{ border: "1px solid #ddd", padding: "10px" }}>
            <img src={form.logo} alt={form.name} width="120" />
            <h1>{form.name}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FormCards