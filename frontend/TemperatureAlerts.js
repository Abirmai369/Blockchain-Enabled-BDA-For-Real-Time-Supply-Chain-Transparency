import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function TemperatureAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call - Replace with your actual API
    // fetch('http://localhost:8000/api/temperature-alerts/')
    setTimeout(() => {
      setAlerts([
        { id: 1, shipment: "SH-001", temp: 8.5, status: "Normal", location: "Warehouse A" },
        { id: 2, shipment: "SH-002", temp: 12.3, status: "Violated", location: "Truck B" },
        { id: 3, shipment: "SH-003", temp: 6.2, status: "Normal", location: "Warehouse C" },
        { id: 4, shipment: "SH-004", temp: 15.8, status: "Violated", location: "Truck D" },
        { id: 5, shipment: "SH-005", temp: 7.1, status: "Normal", location: "Storage E" },
        { id: 6, shipment: "SH-006", temp: 5.9, status: "Normal", location: "Cold Room F" },
        { id: 7, shipment: "SH-007", temp: 11.4, status: "Violated", location: "Transit G" }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '24px',
        color: '#64748b'
      }}>
        Loading Temperature Data...
      </div>
    );
  }

  const normalCount = alerts.filter(a => a.status === "Normal").length;
  const violatedCount = alerts.filter(a => a.status === "Violated").length;

  const pieData = {
    labels: ['Normal Temperature', 'Temperature Violated'],
    datasets: [{
      data: [normalCount, violatedCount],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14, weight: 'bold' },
          padding: 20
        }
      }
    }
  };

  return (
    <div style={{ padding: '30px 20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: '#1e293b',
          marginBottom: '10px'
        }}>
          🌡️ Temperature Monitoring
        </h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>
          Cold-chain compliance tracking
        </p>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Normal Shipments</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{normalCount}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>✅ Within range</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Violated Shipments</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{violatedCount}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>⚠️ Action required</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Compliance Rate</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
              {((normalCount / alerts.length) * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>📊 Overall</div>
          </div>
        </div>

        {/* Chart and Alerts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
          
          {/* Pie Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
              Temperature Status Distribution
            </h3>
            <div style={{ height: '300px' }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          {/* Recent Violations */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
              Recent Violations
            </h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {alerts.filter(a => a.status === "Violated").map((alert) => (
                <div key={alert.id} style={{
                  backgroundColor: '#fee2e2',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  borderLeft: '4px solid #ef4444'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{alert.shipment}</div>
                      <div style={{ fontSize: '14px', color: '#64748b', marginTop: '5px' }}>
                        📍 {alert.location}
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {alert.temp}°C
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Alerts Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginTop: '20px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
            All Shipment Temperatures
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Shipment ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Temperature</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>{alert.shipment}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{alert.location}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1e293b' }}>
                    {alert.temp}°C
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: alert.status === "Normal" ? '#dcfce7' : '#fee2e2',
                      color: alert.status === "Normal" ? '#16a34a' : '#dc2626',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TemperatureAlerts;