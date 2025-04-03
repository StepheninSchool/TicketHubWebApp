import React, { useState } from 'react';
import './App.css';

function App() {
  console.log("App loaded"); // For debugging

  const initialTicketData = {
    ConcertId: 1,
    Email: '',
    Name: '',
    Phone: '',
    Quantity: 1,
    CreditCard: '',
    Expiration: '',
    SecurityCode: '',
    Address: '',
    City: '',
    Province: '',
    PostalCode: '',
    Country: ''
  };

  const [ticketData, setTicketData] = useState(initialTicketData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the absolute URL to your API endpoint.
      const apiUrl = 'https://nscc-0448750-tickets-api-ffesg5ggdqf9fvht.canadacentral-01.azurewebsites.net/api/Tickets';
      console.log("Posting to:", apiUrl); // Log URL for debugging

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });

      if (response.ok) {
        alert('Ticket submitted successfully!');
        setTicketData(initialTicketData);
      } else {
        alert('Submission failed.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('An error occurred.');
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1>Parcels Live in Concert</h1>
        <h4>Coke Cola Stadium, Toronto</h4>
        <p>October 21, 2025</p>
        <img src="/parcels.jpg" alt="Parcels" className="img-fluid rounded shadow-sm" />
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">Ticket Purchase Form</h4>
          <form onSubmit={handleSubmit} className="row g-3">
            <input type="hidden" name="ConcertId" value={ticketData.ConcertId} />

            {[
              { label: 'Email Address', name: 'Email', type: 'email' },
              { label: 'Full Name', name: 'Name', type: 'text' },
              { label: 'Phone Number', name: 'Phone', type: 'tel' },
              { label: 'Quantity', name: 'Quantity', type: 'number', min: 1, max: 10 },
              { label: 'Credit Card Number', name: 'CreditCard', type: 'text' },
              { label: 'Expiration (MM/YY)', name: 'Expiration', type: 'text' },
              { label: 'Security Code', name: 'SecurityCode', type: 'text' },
              { label: 'Street Address', name: 'Address', type: 'text' },
              { label: 'City', name: 'City', type: 'text' },
              { label: 'Province', name: 'Province', type: 'text' },
              { label: 'Postal Code', name: 'PostalCode', type: 'text' },
              { label: 'Country', name: 'Country', type: 'text' }
            ].map(({ label, name, ...rest }) => (
              <div className="col-md-6" key={name}>
                <label htmlFor={name} className="form-label">{label}</label>
                <input
                  className="form-control"
                  id={name}
                  name={name}
                  value={ticketData[name]}
                  onChange={handleChange}
                  required
                  {...rest}
                />
              </div>
            ))}

            <div className="col-12 mt-3">
              <button type="submit" className="btn btn-primary w-100">Purchase Ticket</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
