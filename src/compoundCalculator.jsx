import React, { useState } from 'react';

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

  // 2. Logic: Capitalize Name (LLM/Helper logic)
  const formatName = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // 3. Logic: Extract Time Unit and Value
  const parseTime = (input) => {
    const value = parseFloat(input.replace(/[^0-9.]/g, ''));
    const lowerInput = input.toLowerCase();
    
    let unit = 'year'; // default
    if (lowerInput.includes('day')) unit = 'day';
    else if (lowerInput.includes('week')) unit = 'week';
    else if (lowerInput.includes('month')) unit = 'month';
    
    return { value, unit };
  };

  const calculate = (e) => {
    e.preventDefault();
    setError('');

    const formattedName = formatName(formData.name);
    const { value: timeValue, unit: timeUnit } = parseTime(formData.timeStr);
    const principal = parseFloat(formData.principal);
    let annualRate = parseFloat(formData.rate) / 100; // Convert percentage to decimal

    // 4. Error Handling
    if (isNaN(principal) || isNaN(annualRate) || isNaN(timeValue)) {
      setError("Please ensure the amount, rate, and time are valid numbers.");
      return;
    }

    // 5. Rate Adjustment based on Time Unit
    let adjustedRate = annualRate;
    if (timeUnit === "day") adjustedRate = annualRate / 365;
    else if (timeUnit === "week") adjustedRate = annualRate / 52;
    else if (timeUnit === "month") adjustedRate = annualRate / 12;

    // 6. Compound Interest Formula: A = P(1 + r)^t
    const amount = principal * Math.pow(1 + adjustedRate, timeValue);

    setResult({
      name: formattedName,
      total: amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      time: timeValue,
      unit: timeUnit
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '12px' }}>
      <h2>Compound Interest Calculator</h2>
      
      <form onSubmit={calculate}>
        <div style={{ marginBottom: '10px' }}>
          <label>Full Name:</label>
          <input type="text" style={{ width: '100%' }} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Principal Amount ($):</label>
          <input type="text" style={{ width: '100%' }} value={formData.principal} onChange={(e) => setFormData({...formData, principal: e.target.value})} required />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Annual Interest Rate (%):</label>
          <input type="number" step="0.01" style={{ width: '100%' }} value={formData.rate} onChange={(e) => setFormData({...formData, rate: e.target.value})} required />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Duration (e.g., "12 months" or "5 years"):</label>
          <input type="text" style={{ width: '100%' }} value={formData.timeStr} onChange={(e) => setFormData({...formData, timeStr: e.target.value})} required />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Calculate</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f4f4f4', borderRadius: '8px' }}>
          <h3>Welcome {result.name},</h3>
          <p>Based on your input, you will get <strong>${result.total}</strong> in {result.time} {result.unit}(s).</p>
        </div>
      )}
    </div>
  );
};

export default CompoundCalculator;
