import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ShipmentDashboard() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call - Replace with your actual API
    // fetch('http://localhost:8000/api/shipments/')
    setTimeout(() => {
      setShipments([
        { id: "SH-001", origin: "Mumbai", destination: "Delhi", status: "Delivered", days: 3 },
        { id: "SH-002", origin: "Chennai", destination: "Bangalore", status: "In Transit", days: 1 },
        { id: "SH-003", origin: "Kolkata", destination: "Hyderabad", status: "Delivered", days: 4 },
        { id: "SH-004", origin: "Delhi", destination: "Mumbai", status: "Pending", days: 0 },
        { id: "SH-005", origin: "Bangalore", destination: "Chennai", status: "Delivered", days: 2 },
        { id: "SH-006", origin: "Hyderabad", destination: "Kolkata", status: "In Transit", days: 2 },
        { id: "SH-007", origin: "Mumbai", destination: "Bangalore", status: "Delivered", days: 3 }
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
        Loading Shipment Data...
      </div>
    );
  }

  const deliveredCount = shipments.filter(s => s.status === "Delivered").length;
  const inTransitCount = shipments.filter(s => s.status === "In Transit").length;
  const pendingCount = shipments.filter(s => s.status === "Pending").length;

  // Bar Chart - Shipments by Status
  const barData = {
    labels: ['Delivered', 'In Transit', 'Pending'],
    datasets: [{
      label: 'Number of Shipments',
      data: [deliveredCount, inTransitCount, pendingCount],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderRadius: 8,
      borderWidth: 2,
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(245, 158, 11, 1)'
      ]
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return { bg: '#dcfce7', color: '#16a34a' };
      case "In Transit": return { bg: '#dbeafe', color: '#2563eb' };
      case "Pending": return { bg: '#fef3c7', color: '#d97706' };
      default: return { bg: '#f1f5f9', color: '#64748b' };
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
          📦 Shipment Dashboard
        </h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>
          Track and monitor all shipments
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
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Delivered</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{deliveredCount}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>✅ Completed</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>In Transit</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{inTransitCount}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>🚚 On the way</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Pending</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{pendingCount}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>⏳ Waiting</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Shipments</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{shipments.length}</div>
            {/* ✅ FIXED: Removed extra quote after 0.8 */}
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>📊 All time</div>
          </div>
        </div>

        {/* Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
            Shipment Status Overview
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Shipment Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
            All Shipments
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Shipment ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Origin</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Destination</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Days</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => {
                const statusStyle = getStatusColor(shipment.status);
                return (
                  <tr key={shipment.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>{shipment.id}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{shipment.origin}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{shipment.destination}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1e293b' }}>
                      {shipment.days}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {shipment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShipmentDashboard;