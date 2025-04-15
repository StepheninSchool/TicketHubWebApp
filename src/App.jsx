import React, { useState } from 'react'
import './App.css'

function App () {
  console.log('App loaded') // For debugging

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
  }

  const [ticketData, setTicketData] = useState(initialTicketData)

  const handleChange = e => {
    const { name, value } = e.target
    setTicketData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault();
  
    // MM/YY format check source: https://regex101.com/
    const mmYYRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!mmYYRegex.test(ticketData.Expiration)) {
      alert('Expiration must be in MM/YY format');
      return;
    }
  
    // Postal code check (Canadian or US) source: https://regex101.com/
    const postalRegex = /(^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$)|(^\d{5}(-\d{4})?$)/;
    if (!postalRegex.test(ticketData.PostalCode)) {
      alert('Enter a valid Canadian or U.S. postal code');
      return;
    }

    // Credit card number check (basic Luhn algorithm)
    // source: https://en.wikipedia.org/wiki/Luhn_algorithm
    
    const luhnCheck = (cardNumber) => {
      const digits = cardNumber.split('').reverse().map(Number);
      const sum = digits.reduce((acc, digit, index) => {
        if (index % 2 === 1) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        return acc + digit;
      }, 0);
      return sum % 10 === 0;
    };

    if (!luhnCheck(ticketData.CreditCard)) {
      alert('Invalid credit card number');
      return;
    }
  
    // Quantity range (although also handled by input attributes)
    if (ticketData.Quantity < 1 || ticketData.Quantity > 10) {
      alert('Ticket quantity must be between 1 and 10');
      return;
    }
  
    // Proceed if valid
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
  
      if (response.ok) {
        alert('Ticket Purchased!');
        setTicketData(initialTicketData);
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert(`An error occurred: ${err.message}`);
    }
  };

  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-custom'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>
            TicketHub
          </a>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav ms-auto'>
              <li className='nav-item'>
                <a className='nav-link' href='#'>
                  Home
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='#'>
                  Events
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='#'>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className='container-fluid py-5'>
        <div className='text-center mb-4'>
          <h1>Parcels Live in Concert</h1>
          <h4>Coke Cola Stadium, Toronto</h4>
          <p>October 21, 2025</p>
          <img
            src='/parcels.jpg'
            alt='Parcels'
            className='img-fluid shadow-lg'
          />
        </div>

        <div className='card shadow-sm'>
          <div className='card-body'>
            <h4 className='card-title mb-3'>Ticket Purchase Form</h4>
            <form onSubmit={handleSubmit} className='row g-3'>
              <input
                type='hidden'
                name='ConcertId'
                value={ticketData.ConcertId}
              />

              <div className='col-md-6'>
                <label htmlFor='Email' className='form-label'>
                  Email
                </label>
                <input
                  className='form-control'
                  id='Email'
                  name='Email'
                  type='email'
                  value={ticketData.Email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='Name' className='form-label'>
                  Full Name
                </label>
                <input
                  className='form-control'
                  id='Name'
                  name='Name'
                  type='text'
                  value={ticketData.Name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='Phone' className='form-label'>
                  Phone Number
                </label>
                <input
                  className='form-control'
                  id='Phone'
                  name='Phone'
                  type='tel'
                  value={ticketData.Phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='Quantity' className='form-label'>
                  Quantity
                </label>
                <input
                  className='Qauntity'
                  id='Quantity'
                  name='Quantity'
                  type='number'
                  min='1'
                  max='10'
                  value={ticketData.Quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='CreditCard' className='form-label'>
                  Credit Card Number
                </label>
                <input
                  className='form-control'
                  id='CreditCard'
                  name='CreditCard'
                  type='text'
                  value={ticketData.CreditCard}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='Expiration' className='form-label'>
                  Expiration (MM/YY)
                </label>
                <input
                  className='form-control'
                  id='Expiration'
                  name='Expiration'
                  type='text'
                  value={ticketData.Expiration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='SecurityCode' className='form-label'>
                  Security Code
                </label>
                <input
                  className='form-control'
                  id='SecurityCode'
                  name='SecurityCode'
                  type='text'
                  value={ticketData.SecurityCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='Address' className='form-label'>
                  Street Address
                </label>
                <input
                  className='form-control'
                  id='Address'
                  name='Address'
                  type='text'
                  value={ticketData.Address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='City' className='form-label'>
                  City
                </label>
                <input
                  className='form-control'
                  id='City'
                  name='City'
                  type='text'
                  value={ticketData.City}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='Province' className='form-label'>
                  Province
                </label>
                <input
                  className='form-control'
                  id='Province'
                  name='Province'
                  type='text'
                  value={ticketData.Province}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='PostalCode' className='form-label'>
                  Postal Code
                </label>
                <input
                  className='form-control'
                  id='PostalCode'
                  name='PostalCode'
                  type='text'
                  value={ticketData.PostalCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label htmlFor='Country' className='form-label'>
                  Country
                </label>
                <input
                  className='form-control'
                  id='Country'
                  name='Country'
                  type='text'
                  value={ticketData.Country}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='col-12 mt-3'>
                <button type='submit' className='btn btn-primary'>
                  Purchase Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className='custom-footer mt-5'>
        <div className='container-fluid text-center'>
          <p className='mb-0'>
            &copy; {new Date().getFullYear()} TicketHub. 
          </p>
        </div>
      </footer>
    </>
  )
}

export default App
