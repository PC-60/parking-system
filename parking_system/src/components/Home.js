import React, { useState } from "react";
import "../styles/parking.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import checkdetails from './CheckParkingDetails.js';

const PARKS = [
  { value: "Park A — Ground Floor",  label: "🅿 Park A — Ground Floor" },
  { value: "Park B — First Floor",   label: "🅿 Park B — First Floor" },
  { value: "Park C — Rooftop",       label: "🅿 Park C — Rooftop" },
  { value: "Park D — Basement",      label: "🅿 Park D — Basement" },
  { value: "Park E — Open Lot",      label: "🅿 Park E — Open Lot" },
];

const VEHICLE_MODELS = [
  { value: "",            label: "— Select Vehicle Type —" },
  { value: "Hatchback",  label: "🚗 Hatchback" },
  { value: "Sedan",      label: "🚙 Sedan" },
  { value: "SUV / MUV",  label: "🚕 SUV / MUV" },
  { value: "Pickup",     label: "🛻 Pickup / Truck" },
  { value: "Van",        label: "🚐 Van / Minivan" },
  { value: "Motorcycle", label: "🏍 Motorcycle / Scooter" },
  { value: "Electric",   label: "⚡ Electric Vehicle" },
  { value: "Other",      label: "🔧 Other" },
];

const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const value = `${hh}:${mm}`;
      const period = h < 12 ? "AM" : "PM";
      const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const label = `${String(dh).padStart(2, "0")}:${mm} ${period}`;
      options.push({ value, label });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

const Home = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    Date: "",
    Vechile_no: "",
    aTime: "",
    dTime: "",
    Park: "",
    Model: "",
  });

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: [event.target.value] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(checkdetails(values));
    if (errors.Date === ' ' && errors.aTime === ' ' && errors.dTime === ' ') {
      axios
        .post("/Home", values)
        .then((res) => {
          navigate("/Home/Slots", {
            state: {
              arrTime:   values.aTime,
              depTime:   values.dTime,
              Vechileno: values.Vechile_no,
              park:      values.Park,
              model:     values.Model,
            },
          });
          console.log(res);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-badge">Smart Parking</div>
        <h1 className="hero-title">Reserve Your Spot</h1>
        <p className="hero-subtitle">Fast, easy parking reservations in seconds</p>
      </div>

      <div className="form-card">
        <form className="parking_form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label"><span className="label-icon">📅</span> Date</label>
            <input
              type="date"
              name="Date"
              className="form-input"
              onChange={handleInput}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.Date && <span className="form-error">{errors.Date}</span>}
          </div>

          <div className="form-group">
            <label className="form-label"><span className="label-icon">🚘</span> Vehicle Number</label>
            <input
              type="text"
              name="Vechile_no"
              className="form-input"
              placeholder="e.g. MH 01 AB 1234"
              onChange={handleInput}
            />
          </div>

          <div className="form-group">
            <label className="form-label"><span className="label-icon">🕐</span> Arrival Time</label>
            <div className="select-wrapper">
              <select name="aTime" className="form-select" onChange={handleInput}>
                <option value="">— Select Arrival Time —</option>
                {TIME_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <span className="select-arrow">▾</span>
            </div>
            {errors.aTime && <span className="form-error">{errors.aTime}</span>}
          </div>

          <div className="form-group">
            <label className="form-label"><span className="label-icon">🕓</span> Departure Time</label>
            <div className="select-wrapper">
              <select name="dTime" className="form-select" onChange={handleInput}>
                <option value="">— Select Departure Time —</option>
                {TIME_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <span className="select-arrow">▾</span>
            </div>
            {errors.dTime && <span className="form-error">{errors.dTime}</span>}
          </div>

          <div className="form-group">
            <label className="form-label"><span className="label-icon">🅿</span> Select Park</label>
            <div className="select-wrapper">
              <select name="Park" className="form-select" onChange={handleInput}>
                <option value="">— Choose a Parking Zone —</option>
                {PARKS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <span className="select-arrow">▾</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label"><span className="label-icon">🚗</span> Vehicle Type</label>
            <div className="select-wrapper">
              <select name="Model" className="form-select" onChange={handleInput}>
                {VEHICLE_MODELS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <span className="select-arrow">▾</span>
            </div>
          </div>

          <div className="form-submit-row">
            <button type="submit" className="submit-btn">
              <span>Find Available Slots</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;