import React, { useState } from 'react';
import VendorDashboard from './components/VendorDashboard';
import ShipmentDashboard from './components/ShipmentDashboard';
import TemperatureAlerts from './components/TemperatureAlerts';
import BlockchainAnalytics from './components/BlockchainAnalytics';

function App() {
  const [activePage, setActivePage] = useState('vendor');

  const renderPage = () => {
    switch(activePage) {
      case 'vendor': return <VendorDashboard />;
      case 'shipment': return <ShipmentDashboard />;
      case 'temperature': return <TemperatureAlerts />;
      case 'blockchain': return <BlockchainAnalytics />;
      default: return <VendorDashboard />;
    }
  };

  return (
    <div>
      {/* Navigation */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '15px 30px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, marginRight: '20px', color: '#1e293b' }}>Supply Chain Dashboard</h2>
          
          <button onClick={() => setActivePage('vendor')} style={{
            padding: '10px 20px',
            backgroundColor: activePage === 'vendor' ? '#667eea' : '#e2e8f0',
            color: activePage === 'vendor' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            📊 Vendors
          </button>

          <button onClick={() => setActivePage('shipment')} style={{
            padding: '10px 20px',
            backgroundColor: activePage === 'shipment' ? '#667eea' : '#e2e8f0',
            color: activePage === 'shipment' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            📦 Shipments
          </button>

          <button onClick={() => setActivePage('temperature')} style={{
            padding: '10px 20px',
            backgroundColor: activePage === 'temperature' ? '#667eea' : '#e2e8f0',
            color: activePage === 'temperature' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            🌡️ Temperature
          </button>

          <button onClick={() => setActivePage('blockchain')} style={{
            padding: '10px 20px',
            backgroundColor: activePage === 'blockchain' ? '#667eea' : '#e2e8f0',
            color: activePage === 'blockchain' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            ⛓️ Blockchain
          </button>
        </div>
      </div>

      {/* Page Content */}
      {renderPage()}
    </div>
  );
}

export default App;