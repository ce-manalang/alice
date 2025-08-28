'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CheckoutPageProps {
  searchParams: Promise<{
    productId?: string
    productName?: string
    productPrice?: string
    productImage?: string
  }>
}

export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = use(searchParams)
  const [formData, setFormData] = useState({
    email: '',
    newsOffers: false,
    paymentMethod: 'credit',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    nameOnCard: '',
    country: 'Philippines',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    postalCode: '',
    city: '',
    region: 'Metro Manila',
    phone: '',
    saveInfo: true,
    mobilePhone: '+63'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Mock product data - in real app, this would come from props or API
  const product = {
    name: params.productName || 'Pixel Perfect',
    price: params.productPrice || 'P600.00',
    image: params.productImage || '/assets/images/placeholder.jpg',
    quantity: 1
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1><Link href="/">centimentalcomics</Link></h1>
      </div>
      
      <div className="checkout-content">
        {/* Left Column - Checkout Form */}
        <div className="checkout-form-column">
          <div className="express-checkout">
            <h3>Express checkout</h3>
            <div className="express-buttons">
              <button className="express-btn shop-btn">shop</button>
              <button className="express-btn paypal-btn">
                <span className="paypal-logo">PayPal</span>
              </button>
              <button className="express-btn gpay-btn">
                <span className="gpay-logo">G Pay</span>
              </button>
            </div>
            <div className="or-divider">OR</div>
          </div>

          <form className="checkout-form">
            {/* Contact Section */}
            <div className="form-section">
              <h3>Contact</h3>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="newsOffers"
                  name="newsOffers"
                  checked={formData.newsOffers}
                  onChange={handleInputChange}
                />
                <label htmlFor="newsOffers">Email me with news and offers</label>
              </div>
            </div>

            {/* Payment Section */}
            <div className="form-section">
              <h3>Payment</h3>
              <p className="payment-subtitle">All transactions are secure and encrypted.</p>
              
              <div className="payment-methods">
                <div className="payment-option">
                  <input
                    type="radio"
                    id="credit"
                    name="paymentMethod"
                    value="credit"
                    checked={formData.paymentMethod === 'credit'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="credit">Credit card</label>
                  <div className="card-logos">
                    <span>VISA</span>
                    <span>Mastercard</span>
                    <span>AMEX</span>
                    <span>+5</span>
                  </div>
                </div>

                <div className="card-details">
                  <div className="form-group">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                    <span className="input-icon">🔒</span>
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="Expiration date (MM/YY)"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                    <input
                      type="text"
                      name="securityCode"
                      placeholder="Security code"
                      value={formData.securityCode}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                    <span className="input-icon">?</span>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="nameOnCard"
                      placeholder="Name on card"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="payment-option">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="paypal">PayPal</label>
                  <span className="paypal-logo-small">PayPal</span>
                </div>
              </div>
            </div>

            {/* Billing Address Section */}
            <div className="form-section">
              <h3>Billing address</h3>
              
              <div className="form-group">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Philippines">Philippines</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>

              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="company"
                  placeholder="Company (optional)"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Metro Manila">Metro Manila</option>
                  <option value="Cebu">Cebu</option>
                  <option value="Davao">Davao</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <span className="input-icon">?</span>
              </div>
            </div>

            {/* Remember Me Section */}
            <div className="form-section">
              <h3>Remember me</h3>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="saveInfo"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                />
                <label htmlFor="saveInfo">Save my information for a faster checkout with a Shop account</label>
              </div>
              
              <div className="form-group">
                <input
                  type="tel"
                  name="mobilePhone"
                  placeholder="Mobile phone number"
                  value={formData.mobilePhone}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <span className="input-icon">📱</span>
              </div>
            </div>

            {/* Security and Submit */}
            <div className="form-section">
              <div className="security-info">
                <span className="security-text">🔒 Secure and encrypted</span>
              </div>
              
              <button type="submit" className="pay-now-btn">
                Pay now
              </button>
              
              <div className="terms-text">
                Your info will be saved to a Shop account. By continuing, you agree to Shop's <a href="#">Terms of Service</a> and acknowledge the <a href="#">Privacy Policy</a>.
              </div>
            </div>
          </form>

          <div className="checkout-footer">
            <p>All rights reserved centimentalcomics</p>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="order-summary-column">
          <div className="order-summary">
            <div className="product-summary">
              <div className="product-image">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="product-thumbnail"
                />
                <div className="quantity-badge">{product.quantity}</div>
              </div>
              <div className="product-details">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-type">Digital</p>
              </div>
              <div className="product-price">
                {product.price}
              </div>
            </div>

            <div className="discount-section">
              <div className="discount-input-group">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="discount-input"
                />
                <button className="apply-btn">Apply</button>
              </div>
            </div>

            <div className="total-section">
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-amount">PHP {product.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
