import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const POSCenterSelection = ({ onSelect }) => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://mani.citruspms.site/API/POS_GetPosCenters.aspx')
      .then(response => response.json())
      .then(data => {
        setCenters(data);
        setLoading(false);
        console.log('Centers after fetch:', data);
      })
      .catch(error => {
        console.error('Error fetching POS centers:', error);
        setError('Failed to load POS centers. Please try again.');
        setLoading(false);
      });
  }, []);

  const handleSelectChange = (e) => {
    const selectedCenterID = parseInt(e.target.value, 10);
    console.log('Selected value:', selectedCenterID);
    
    const selectedCenter = centers.find(center => center.POSCenterID === selectedCenterID);
    console.log('Found center:', selectedCenter);
    
    if (selectedCenter) {
      console.log('Calling onSelect with:', selectedCenter.POSCenterID, selectedCenter.POSCenterCode);
      onSelect(selectedCenter.POSCenterID, selectedCenter.POSCenterCode);
    } else {
      console.log('Calling onSelect with null values');
      onSelect(null, null);
    }
  };

  if (loading) return <div className="text-center">Loading POS centers...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', marginTop: '-10vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%', backgroundColor: '#f8f9fa' }}>
        <h3 className="text-center mb-4" style={{ fontFamily: 'Arial, sans-serif', fontSize: '1.5rem', color: '#343a40' }}>
          Select the POS Center
        </h3>
        <select className="form-select" onChange={handleSelectChange} defaultValue="">
          <option value="" disabled>Select POS Center / Restaurant</option>
          {centers.map(center => (
            <option key={center.POSCenterID} value={center.POSCenterID}>
              {center.POSCenterName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default POSCenterSelection;