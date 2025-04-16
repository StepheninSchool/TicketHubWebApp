import React, { useState } from 'react'
import './App.css'

function App() {
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
  // State to hold ticket data
  // Using useState to manage the ticket data state
  const [ticketData, setTicketData] = useState(initialTicketData)

  // Function to handle input changes
  // This function updates the ticketData state when the user types in the form fields
  const handleChange = e => {
    const { name, value } = e.target
    setTicketData(prev => ({ ...prev, [name]: value }))
  }

  // Function to handle form submissio
  const handleSubmit = async e => {
    e.preventDefault()

    const apiUrl =
      'https://nscc-0448750-tickets-api-ffesg5ggdqf9fvht.canadacentral-01.azurewebsites.net/api/Tickets'

    //
    //REGEX VALIDATION STARTS HERE
    //

    // MM/YY format check source: https://regex101.com/
    const mmYYRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!mmYYRegex.test(ticketData.Expiration)) {
      alert('Expiration must be in MM/YY format')
      return
    }

    // Postal code check (Canadian or US) source: https://regex101.com/
    const postalRegex =
      /(^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$)|(^\d{5}(-\d{4})?$)/
    if (!postalRegex.test(ticketData.PostalCode)) {
      alert('Enter a valid Canadian or U.S. postal code')
      return
    }

    // Name check (2–50 characters, letters, spaces, periods, apostrophes, or hyphens)
    const nameRegex = /^[a-zA-Z\s.'-]{2,50}$/
    if (!nameRegex.test(ticketData.Name)) {
      alert(
        'Name must only contain letters, spaces, periods, apostrophes, or hyphens (2–50 characters)'
      )
      return
    }

    // Phone number check (10–15 digits) source: https://regex101.com/
    // Allows optional '+' at the start for country code
    const phoneRegex = /^\+?\d{10,15}$/
    if (!phoneRegex.test(ticketData.Phone)) {
      alert('Enter a valid 10 digit phone number (with optional country code)')
      return
    }

    // Security code check (3 or 4 digits) source: https://regex101.com/
    // Allows only digits
    const cvcRegex = /^\d{3,4}$/
    if (!cvcRegex.test(ticketData.SecurityCode)) {
      alert('Security Code must be 3 or 4 digits')
      return
    }
    // country check (2–50 characters, letters, spaces, hyphens, or apostrophes) source: https://regex101.com/
    const countryRegex = /^[a-zA-Z\s'-]{2,50}$/
    if (!countryRegex.test(ticketData.Country)) {
      alert(
        'Country must only contain letters, spaces, hyphens, or apostrophes'
      )
      return
    }
    // Address check (5–100 characters, letters, numbers, spaces, commas, hyphens, or periods)
    const addressRegex = /^[a-zA-Z0-9\s,#.-]{5,100}$/
    if (!addressRegex.test(ticketData.Address)) {
      alert(
        'Address can include letters, numbers, spaces, commas, hyphens, or periods (min 5 characters)'
      )
      return
    }

    // City check (2–50 characters, letters, spaces, periods, apostrophes, or hyphens)
    const cityRegex = /^[a-zA-Z\s.'-]{2,50}$/
    if (!cityRegex.test(ticketData.City)) {
      alert(
        'City must only contain letters, spaces, periods, apostrophes, or hyphens (2–50 characters)'
      )
      return
    }

    //Province/State check (2–100 characters, letters, spaces, periods, apostrophes, or hyphens)
    const provinceRegex = /^[a-zA-Z\s.'-]{2,100}$/
    if (!provinceRegex.test(ticketData.Province)) {
      alert(
        'Province/State must only contain letters, spaces, periods, apostrophes, or hyphens'
      )
      return
    }
    //
    //REGEX VALIDATION ENDS HERE
    //

    // Credit card number check (basic Luhn algorithm)
    // source: https://en.wikipedia.org/wiki/Luhn_algorithm

    const luhnCheck = cardNumber => {
      // Remove spaces and dashes from the card number
      const digits = cardNumber.split('').reverse().map(Number)

      // Check if the card number is valid (only digits)
      if (digits.some(isNaN)) {
        alert('Credit card number must contain only digits.')
        return false
      }

      const sum = digits.reduce((acc, digit, index) => {
        // If the index is odd, double the digit
        // If the result is greater than 9, subtract 9
        if (index % 2 === 1) {
          digit *= 2
          if (digit > 9) digit -= 9
        }
        // Sum the digits
        return acc + digit
      }, 0)
      // Check if the sum is divisible by 10
      // If it is, the card number is valid
      return sum % 10 === 0
    }

    if (!luhnCheck(ticketData.CreditCard)) {
      alert('Invalid credit card number. Please check and try again.')
      return
    }

    // Quantity range (although also handled by input attributes)
    if (ticketData.Quantity < 1 || ticketData.Quantity > 4) {
      alert(
        'Ticket quantity must be between 1 and 4. Please adjust your selection'
      )
      return
    }

    // Proceed if valid
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      })

      if (response.ok) {
        alert('Ticket Purchased!')
        setTicketData(initialTicketData)
      } else {
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
      {/* Bootstrap Navbar */}
      <nav className='navbar navbar-expand-lg navbar-custom fixed-top'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>
            TicketHub
          </a>
          {/* Navbar toggler for mobile view */}
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

      {/* Main content area with padding for the navbar */}
      <div className="container pt-5 mt-5">
        <div className="row align-items-center">
          {/* Left: Carousel */}
          
          <div className="col-md-6 mb-4 mb-md-0">
            <div
              id="parcelsCarousel"
              className="carousel slide carousel-fade"
              data-bs-ride="carousel"
              data-bs-interval="10000"
              position='center'
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="/parcels.jpg"
                    className="d-block w-100 rounded shadow"
                    alt="Parcels"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="/parcels1.jpg"
                    className="d-block w-100 rounded shadow"
                    alt="Parcels 1"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="/parcels2.jpg"
                    className="d-block w-100 rounded shadow"
                    alt="Parcels 2"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="/parcels3.jpg"
                    className="d-block w-100 rounded shadow"
                    alt="Parcels 3"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="/parcels4.jpg"
                    className="d-block w-100 rounded shadow"
                    alt="Parcels 4"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="/parcels5.jpg"
                    className="d-block w-100 rounded shadow"
                    alt="Parcels 5"
                  />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#parcelsCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#parcelsCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          {/* Right: Event Details */}
          <div className="col-md-6">
            <h1 className="mb-3">Parcels Live in Concert</h1>
            <h4 className="mb-2">Coke Cola Stadium, Toronto</h4>
            <p className="mb-3">October 21, 2025 — 7:30 PM</p>
            <p className="lead text-muted">
              Get ready to move — <strong>Parcels</strong> brings their
              signature blend of <em>disco, funk,</em> and <em>electro-pop</em>{' '}
              to the stage. Experience the energy, the groove, and the
              unforgettable vibes of a band that knows how to light up the
              night.
            </p>
            <p className="text-success fw-bold">
              Tickets: $59.99 — Max 4 per order
            </p>
          </div>
        </div>
      </div>
      <button
        className='carousel-control-prev'
        type='button'
        data-bs-target='#parcelsCarousel'
        data-bs-slide='prev'
      >
        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
        <span className='visually-hidden'>Previous</span>
      </button>
      <button
        className='carousel-control-next'
        type='button'
        data-bs-target='#parcelsCarousel'
        data-bs-slide='next'
      >
        <span className='carousel-control-next-icon' aria-hidden='true'></span>
        <span className='visually-hidden'>Next</span>
      </button>
      
      {/* Form for ticket purchase */}
      <div className='card shadow-sm mt-5'>
        <div className='card-body mt-2'>
          <h4 className='card-title mb-3'>Enter purchase details below: </h4>
          <form onSubmit={handleSubmit} className='row g-3'>
            <input
              type='hidden'
              name='ConcertId'
              value={ticketData.ConcertId}
            />
            {/* Email field */}
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
            {/* Name field */}
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
            {/* Phone Number field */}
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
            {/* Ticket Quantity field */}
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
            {/* Credit Card field */}
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
            {/* Expiration field */}
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
            {/* Security Code field */}
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
            {/* Address field */}
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
            {/* City field */}
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
            {/* Province field */}
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
            {/* Postal Code field */}
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
            {/* Country field */}
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
              <button
                type='submit'
                className='btn-primary d-block mx-auto border-5 rounded-pill shadow-lg'
              >
                Purchase Ticket
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className='custom-footer mt-5'>
        <div className='container-fluid text-center'>
          <p className='mb-0'>&copy; {new Date().getFullYear()} TicketHub.</p>
        </div>
      </footer>
    </>
  )
}

export default App
