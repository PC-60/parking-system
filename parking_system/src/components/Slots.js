import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/slots.css';

const Slots = () => {
  const numRows = 5;
  const slotsPerRow = 10;

  const location = useLocation();
  const arr       = location.state?.arrTime;
  const dep       = location.state?.depTime;
  const vecno     = location.state?.Vechileno;
  const parkName  = location.state?.park  || 'Park A';
  const modelName = location.state?.model || 'Vehicle';

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotData,     setSlotData]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [booking,      setBooking]      = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchSlotData(); }, []);

  const fetchSlotData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/Home/Slots');
      setSlotData(response.data);
    } catch (error) {
      console.error('Error fetching slot data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert "HH:MM" string to total minutes integer for safe comparison
  const toMins = (t) => {
    if (!t) return 0;
    const str = Array.isArray(t) ? t[0] : String(t);
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  };

  // Returns remaining minutes if slot is occupied during user's window, else null
  const calculateRemainingTime = (slotNum) => {
    if (!slotData || slotData.length === 0) return null;

    const userStart = toMins(arr);
    const userEnd   = toMins(dep);

    for (let i = 0; i < slotData.length; i++) {
      const dataslot = slotData[i];
      // MongoDB stores slot as Long object — normalise to plain number
      const storedSlot =
        dataslot.slot && typeof dataslot.slot === 'object'
          ? Number(dataslot.slot)
          : Number(dataslot.slot);

      if (storedSlot === slotNum) {
        const bookStart = toMins(dataslot.startTime);
        const bookEnd   = toMins(dataslot.endTime);

        // Any overlap between [userStart, userEnd) and [bookStart, bookEnd)
        const overlaps = userStart < bookEnd && userEnd > bookStart;
        if (overlaps) {
          const remaining = bookEnd - userStart;
          return Math.max(0, remaining);
        }
      }
    }
    return null;
  };

  const handleSlotClick = (slotNum) => {
    if (calculateRemainingTime(slotNum) !== null) return; // occupied
    setSelectedSlot(slotNum === selectedSlot ? null : slotNum);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) { alert('Please select a slot first.'); return; }
    setBooking(true);

    const data = {
      selectedSlot,
      Vechile_no: vecno,
      arr,
      dep,
    };

    try {
      await axios.post('/Home/Slots', data);

      const bookingRef = 'PRK' + Date.now().toString().slice(-6).toUpperCase();

      navigate('/Home/Slots/Confirmation', {
        state: {
          bookingRef,
          slotNumber:    selectedSlot,
          vehicleNo:     Array.isArray(vecno)  ? vecno[0]  : vecno,
          model:         Array.isArray(modelName) ? modelName[0] : modelName,
          park:          Array.isArray(parkName)  ? parkName[0]  : parkName,
          arrivalTime:   Array.isArray(arr) ? arr[0] : arr,
          departureTime: Array.isArray(dep) ? dep[0] : dep,
          bookedAt:      new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
        },
      });
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const totalSlots    = numRows * slotsPerRow;
  const occupiedCount = Array.from({ length: totalSlots }, (_, i) => i + 1)
    .filter((n) => calculateRemainingTime(n) !== null).length;
  const availableCount = totalSlots - occupiedCount;

  return (
    <div className="slots-page">
      <div className="slots-header">
        <div className="slots-hero-badge">Step 2 of 2</div>
        <h2>🅿 Select Your Spot</h2>
        <p>Tap an available slot to select it, then confirm your booking</p>
      </div>

      <div className="slots-stats">
        <div className="stat-pill"><span className="stat-dot green"></span>{availableCount} Available</div>
        <div className="stat-pill"><span className="stat-dot grey"></span>{occupiedCount} Occupied</div>
        <div className="stat-pill"><span className="stat-dot blue"></span>{totalSlots} Total</div>
      </div>

      <div className="slots-legend">
        <div className="legend-item"><div className="legend-dot available"></div><span>Available</span></div>
        <div className="legend-item"><div className="legend-dot selected"></div><span>Your Selection</span></div>
        <div className="legend-item"><div className="legend-dot booked"></div><span>Occupied</span></div>
      </div>

      <div className="slots-card">
        {loading ? (
          <div className="slots-loading">
            <div className="spinner"></div>
            <p>Loading slot availability…</p>
          </div>
        ) : (
          <>
            <div id="slot-container">
              {Array.from({ length: numRows }, (_, row) => (
                <div className="slot-row" key={row}>
                  <div className="row-label">Row {String.fromCharCode(65 + row)}</div>
                  <div className="slot-row-slots">
                    {Array.from({ length: slotsPerRow }, (_, slotNum) => {
                      const slotNumber    = row * slotsPerRow + slotNum + 1;
                      const remainingTime = calculateRemainingTime(slotNumber);
                      const isBooked      = remainingTime !== null;
                      const isSelected    = slotNumber === selectedSlot;

                      return (
                        <div
                          key={slotNumber}
                          className={`slot ${isBooked ? 'booked' : isSelected ? 'selected' : 'free'}`}
                          onClick={() => handleSlotClick(slotNumber)}
                        >
                          <span className="slot-number">{slotNumber}</span>
                          {isSelected && <span className="slot-check">✓</span>}
                          {isBooked && remainingTime > 0 && (
                            <div className="remaining-time-box">{remainingTime} min left</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="slots-actions">
              <div className="selected-info">
                {selectedSlot
                  ? <span>Slot <strong>#{selectedSlot}</strong> selected &mdash; {Array.isArray(arr) ? arr[0] : arr} → {Array.isArray(dep) ? dep[0] : dep}</span>
                  : <span className="muted">No slot selected yet</span>}
              </div>
              <button className="book-btn" onClick={handleSubmit} disabled={!selectedSlot || booking}>
                {booking ? 'Booking…' : 'Confirm Booking →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Slots;