import React, { useEffect, useState } from "react";
import { getVendorPerformance } from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function VendorDashboard() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorPerformance()
      .then(res => {
        setVendors(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        // Fallback test data
        setVendors([
          { name: "Vendor A", total_shipments: 450, on_time: 420, revenue: 125000 },
          { name: "Vendor B", total_shipments: 380, on_time: 350, revenue: 98000 },
          { name: "Vendor C", total_shipments: 520, on_time: 480, revenue: 156000 },
          { name: "Vendor D", total_shipments: 290, on_time: 270, revenue: 87000 },
          { name: "Vendor E", total_shipments: 410, on_time: 390, revenue: 112000 }
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          Loading Dashboard...
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalShipments = vendors.reduce((sum, v) => sum + v.total_shipments, 0);
  const totalRevenue = vendors.reduce((sum, v) => sum + v.revenue, 0);
  const totalOnTime = vendors.reduce((sum, v) => sum + v.on_time, 0);
  const totalDelayed = totalShipments - totalOnTime;
  const avgOnTime = ((totalOnTime / totalShipments) * 100).toFixed(1);

  // Bar Chart Configuration
  const barChartData = {
    labels: vendors.map(v => v.name),
    datasets: [
      {
        label: 'Total Shipments',
        data: vendors.map(v => v.total_shipments),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#1e293b'
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 12 },
          color: '#64748b'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 12 },
          color: '#64748b'
        }
      }
    }
  };

  // Doughnut Chart Configuration
  const doughnutChartData = {
    labels: ['On Time', 'Delayed'],
    datasets: [
      {
        data: [totalOnTime, totalDelayed],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#1e293b',
          padding: 20
        }
      }
    }
  };

  // Line Chart Configuration
  const lineChartData = {
    labels: vendors.map(v => v.name),
    datasets: [
      {
        label: 'Revenue ($)',
        data: vendors.map(v => v.revenue),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#1e293b'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 12 },
          color: '#64748b',
          callback: function(value) {
            return '$' + (value / 1000).toFixed(0) + 'K';
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 12 },
          color: '#64748b'
        }
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            margin: '0 0 10px 0',
            letterSpacing: '-1px'
          }}>
            📊 Vendor Analytics Dashboard
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '18px',
            margin: '0',
            fontWeight: '300'
          }}>
            Real-time performance insights and metrics
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Card 1 */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>
              Total Shipments
            </div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', lineHeight: '1' }}>
              {totalShipments.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              📦 Across all vendors
            </div>
          </div>

          {/* Card 2 */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>
              On-Time Rate
            </div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', lineHeight: '1' }}>
              {avgOnTime}%
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              ✅ Average delivery performance
            </div>
          </div>

          {/* Card 3 */}
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', lineHeight: '1' }}>
              ${(totalRevenue / 1000).toFixed(0)}K
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              💰 Combined earnings
            </div>
          </div>

          {/* Card 4 */}
          <div style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>
              Active Vendors
            </div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', lineHeight: '1' }}>
              {vendors.length}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              🏢 Partners
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          
          {/* Bar Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              Shipments by Vendor
            </h3>
            <div style={{ height: '320px' }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Doughnut Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>🎯</span>
              Delivery Performance
            </h3>
            <div style={{ height: '320px' }}>
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </div>

        {/* Revenue Line Chart - Full Width */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          marginBottom: '30px',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>💰</span>
            Revenue Trend Analysis
          </h3>
          <div style={{ height: '320px' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Vendor Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>📋</span>
            Detailed Vendor Performance
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Vendor</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Total Shipments</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#475569', fontSize: '14px' }}>On-Time</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Rate</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, index) => {
                  const rate = (vendor.on_time / vendor.total_shipments) * 100;
                  return (
                    <tr 
                      key={index} 
                      style={{ 
                        borderBottom: '1px solid #e2e8f0',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td style={{ padding: '16px', fontWeight: '600', color: '#1e293b' }}>
                        {vendor.name}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>
                        {vendor.total_shipments}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>
                        {vendor.on_time}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: rate >= 90 ? '#dcfce7' : '#fee2e2',
                          color: rate >= 90 ? '#16a34a' : '#dc2626',
                          padding: '6px 14px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'inline-block'
                        }}>
                          {rate.toFixed(1)}%
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#1e293b' }}>
                        ${vendor.revenue.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          color: 'rgba(255,255,255,0.8)',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0' }}>
            © 2026 Vendor Management System • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;