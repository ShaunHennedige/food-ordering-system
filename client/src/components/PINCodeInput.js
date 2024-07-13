import React, { useState } from 'react';

const PINCodeInput = () => {
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState(null);

  const handlePinChange = (event) => {
    setPinCode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (pinCode === '1234') {
      // Allow access if the PIN code is correct
      console.log('Access granted!');
    } else {
      setError('Invalid PIN code. Please try again.');
    }
  };

  return (
    <div className="pin-code-input">
      <form onSubmit={handleSubmit}>
        <label>
          Enter PIN Code:
          <input type="password" value={pinCode} onChange={handlePinChange} />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PINCodeInput;