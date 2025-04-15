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
    e.preventDefault()
    try {
      const apiUrl =
        'https://nscc-0448750-tickets-api-ffesg5ggdqf9fvht.canadacentral-01.azurewebsites.net/api/Tickets'
      console.log('Posting to:', apiUrl)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      })

      if (response.ok) {
        alert('Ticket Purchased!')
        setTicketData(initialTicketData)
      } else {
        // Try to parse response details
        const errorData = await response.json()
        alert(`Submission failed: ${errorData.message || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('Submission error:', err)
      alert(`An error occurred: ${err.message}`)
    }
  }

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
                  className='form-control'
                  id='Quantity'
                  name='Quantity'
                  type='number'
                  min='1'
                  max='4'
                  value={ticketData.Quantity}
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
