import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/confirmed.css';

const Confirmed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state    = location.state || {};

  const {
    bookingRef    = 'PRK000000',
    slotNumber    = '—',
    vehicleNo     = '—',
    model         = '—',
    park          = '—',
    arrivalTime   = '—',
    departureTime = '—',
    bookedAt      = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
  } = state;

  const handlePrint = () => window.print();
  const handleNewBooking = () => navigate('/Home');

  return (
    <div className="receipt-page">
      {/* ── Success Banner ── */}
      <div className="success-banner">
        <div className="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p>Your parking slot has been reserved successfully</p>
      </div>

      {/* ── Receipt Card ── */}
      <div className="receipt-card" id="receipt-print">

        {/* Header */}
        <div className="receipt-header">
          <div className="receipt-brand">
            <span className="receipt-brand-icon">🅿</span>
            <span className="receipt-brand-name">ParkEase</span>
          </div>
          <div className="receipt-ref">
            <div className="ref-label">Booking Reference</div>
            <div className="ref-value">{bookingRef}</div>
          </div>
        </div>

        {/* Ticket tear line */}
        <div className="tear-line">
          <div className="tear-circle left"></div>
          <div className="tear-dashes"></div>
          <div className="tear-circle right"></div>
        </div>

        {/* Slot highlight */}
        <div className="slot-highlight">
          <div className="slot-highlight-label">Your Slot</div>
          <div className="slot-highlight-number">#{slotNumber}</div>
          <div className="slot-highlight-park">{park}</div>
        </div>

        {/* Details grid */}
        <div className="receipt-details">
          <div className="receipt-row">
            <div className="receipt-item">
              <span className="item-icon">🚘</span>
              <div>
                <div className="item-label">Vehicle Number</div>
                <div className="item-value">{vehicleNo}</div>
              </div>
            </div>
            <div className="receipt-item">
              <span className="item-icon">🚗</span>
              <div>
                <div className="item-label">Vehicle Type</div>
                <div className="item-value">{model}</div>
              </div>
            </div>
          </div>

          <div className="receipt-row">
            <div className="receipt-item">
              <span className="item-icon">🕐</span>
              <div>
                <div className="item-label">Arrival Time</div>
                <div className="item-value">{arrivalTime}</div>
              </div>
            </div>
            <div className="receipt-item">
              <span className="item-icon">🕓</span>
              <div>
                <div className="item-label">Departure Time</div>
                <div className="item-value">{departureTime}</div>
              </div>
            </div>
          </div>

          <div className="receipt-row single">
            <div className="receipt-item">
              <span className="item-icon">📅</span>
              <div>
                <div className="item-label">Booked On</div>
                <div className="item-value">{bookedAt}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tear line bottom */}
        <div className="tear-line">
          <div className="tear-circle left"></div>
          <div className="tear-dashes"></div>
          <div className="tear-circle right"></div>
        </div>

        {/* Barcode simulation */}
        <div className="receipt-barcode">
          <div className="barcode-bars">
            {Array.from({ length: 36 }, (_, i) => (
              <div
                key={i}
                className="bar"
                style={{ height: `${Math.random() > 0.4 ? 40 : 24}px` }}
              ></div>
            ))}
          </div>
          <div className="barcode-text">{bookingRef}</div>
        </div>

        {/* Status badge */}
        <div className="receipt-status">
          <span className="status-dot"></span>
          Slot reserved &amp; confirmed
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="receipt-actions">
        <button className="action-btn secondary" onClick={handlePrint}>
          🖨 Print Receipt
        </button>
        <button className="action-btn primary" onClick={handleNewBooking}>
          + New Booking
        </button>
      </div>
    </div>
  );
};

export default Confirmed;