import React, { useState } from 'react';

// ✅ Reusable Input Component
const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div style={{ marginBottom: '10px' }}>
    <label>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      style={{
        width: '100%',
        height: "30px",
        fontSize: "1rem",
        padding: "0.5rem",
        boxSizing: "border-box"
      }}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

const CompoundCalculator = () => {
  // 1. State Management
  const [formData, setFormData] = useState({
    name: '',
    principal: '',
    rate: '',
    timeStr: '',
    compoundingFreq: 'yearly'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // 2. Logic: Capitalize Name
  const formatName = (str) => str ? str.replace(/\b\w/g, char => char.toUpperCase()) : '';

  // 3. Logic: Extract Time Unit and Value
  const parseTime = (input) => {
    const value = parseFloat(input.replace(/[^0-9.]/g, ''));
    const lowerInput = input.toLowerCase();

    const unitMap = {
      day: ['day', 'de', 'dey', 'dei', 'dai'],
      week: ['week', 'weak', 'wek', 'wik', 'wick', 'weck', 'wiik'],
      month: ['month', 'mot', 'moth', 'mont'],
      year: ['year', 'yeah', 'yer', 'yie', 'yii', 'yia']
    };

    let unit;
    for (const [key, synonyms] of Object.entries(unitMap)) {
      if (synonyms.some(s => lowerInput.includes(s))) {
        unit = key;
        break;
      }
    }

    return { value, unit };
  };

  // 4. Calculation Logic
  const calculate = (e) => {
    e.preventDefault();
    setError('');

    const formattedName = formatName(formData.name);
    const { value: timeValue, unit: timeUnit } = parseTime(formData.timeStr);
    const sanitizedPrincipalInput = formData.principal.replace(/[^0-9.]/g, '');
    const principal = parseFloat(sanitizedPrincipalInput);
    const sanitizedRateInput = formData.rate.replace(/[^0-9.]/g, '');
    const annualRate = parseFloat(sanitizedRateInput) / 100;

    if (isNaN(principal) || isNaN(annualRate) || isNaN(timeValue) || !timeUnit) { 
      setError("Please ensure the amount, rate, and time are valid numbers with a proper unit (day, week, month, year).");
      return;
    }

    // Rate adjustment based on unit
    const rateAdjustments = { day: 365, week: 52, month: 12, year: 1 };
    const adjustedRate = annualRate / (rateAdjustments[timeUnit] || 1);

    // Compounding frequency
    const freqMap = { yearly: 1, quarterly: 4, monthly: 12, daily: 365 };
    const n = freqMap[formData.compoundingFreq] || 1;

    // Compound Interest Formula: A = P(1 + r/n)^(n*t)
    const amount = principal * Math.pow(1 + adjustedRate / n, n * timeValue);

    setResult({
      name: formattedName,
      total: amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      time: timeValue,
      unit: timeUnit
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '12px' }}>
      <h2 style={{ textAlign: "center" }}>Compound Interest Calculator</h2>

      <form onSubmit={calculate}>
        <InputField label="Full Name:" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your name" />
        <InputField label="Principal Amount ($):" value={formData.principal} onChange={(e) => setFormData({ ...formData, principal: e.target.value })} placeholder="e.g. 1000" />
        <InputField label="Annual Interest Rate (%):" type="number" value={formData.rate} onChange={(e) => setFormData({ ...formData, rate: e.target.value })} placeholder="e.g. 5" />
        <InputField label="Duration (e.g., '12 months' or '5 years'):" value={formData.timeStr} onChange={(e) => setFormData({ ...formData, timeStr: e.target.value })} placeholder="e.g. 10 years" />

        <div style={{ marginBottom: '10px' }}>
          <label>Compounding Frequency:</label>
          <select
            style={{ width: '100%', height: "35px", fontSize: "1rem", padding: "0.5rem", boxSizing: "border-box", display: "flex", alignItems:"center"}}
            value={formData.compoundingFreq}
            onChange={(e) => setFormData({ ...formData, compoundingFreq: e.target.value })}
          >
            <option value="yearly">Yearly</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Calculate</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div className="result">
          <h3>Welcome {result.name},</h3>
          <p>Based on your input, you will get <strong>${result.total}</strong> in {result.time} {result.unit}(s).</p>
        </div>
      )}
    </div>
  );
};

export default CompoundCalculator;
