import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function BlockchainAnalytics() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call - Replace with your actual API
    // fetch('http://localhost:8000/api/blockchain-transactions/')
    setTimeout(() => {
      setTransactions([
        { date: "Jan 1", total: 45, confirmed: 42, failed: 3 },
        { date: "Jan 2", total: 52, confirmed: 50, failed: 2 },
        { date: "Jan 3", total: 38, confirmed: 35, failed: 3 },
        { date: "Jan 4", total: 61, confirmed: 58, failed: 3 },
        { date: "Jan 5", total: 55, confirmed: 53, failed: 2 },
        { date: "Jan 6", total: 48, confirmed: 46, failed: 2 },
        { date: "Jan 7", total: 67, confirmed: 64, failed: 3 }
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
        Loading Blockchain Data...
      </div>
    );
  }

  const totalTransactions = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalConfirmed = transactions.reduce((sum, t) => sum + t.confirmed, 0);
  const totalFailed = transactions.reduce((sum, t) => sum + t.failed, 0);
  const successRate = ((totalConfirmed / totalTransactions) * 100).toFixed(1);

  // Line Chart - Transactions per day
  const lineData = {
    labels: transactions.map(t => t.date),
    datasets: [{
      label: 'Total Transactions',
      data: transactions.map(t => t.total),
      borderColor: 'rgba(99, 102, 241, 1)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointBackgroundColor: 'rgba(99, 102, 241, 1)'
    }]
  };

  // Bar Chart - Confirmed vs Failed
  const barData = {
    labels: transactions.map(t => t.date),
    datasets: [
      {
        label: 'Confirmed',
        data: transactions.map(t => t.confirmed),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 6
      },
      {
        label: 'Failed',
        data: transactions.map(t => t.failed),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14, weight: 'bold' } }
      }
    },
    scales: {
      y: { beginAtZero: true }
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
          ⛓️ Blockchain Analytics
        </h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>
          Transaction monitoring and verification
        </p>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Transactions</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{totalTransactions}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>📊 Last 7 days</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Confirmed</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{totalConfirmed}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>✅ Verified</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Failed</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{totalFailed}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>❌ Rejected</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Success Rate</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{successRate}%</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>📈 Performance</div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          
          {/* Line Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
              📈 Transactions Per Day
            </h3>
            <div style={{ height: '300px' }}>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
              📊 Confirmed vs Failed
            </h3>
            <div style={{ height: '300px' }}>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
            Daily Transaction Summary
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Confirmed</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Failed</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => {
                const rate = ((txn.confirmed / txn.total) * 100).toFixed(1);
                return (
                  <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>{txn.date}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>{txn.total}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#10b981', fontWeight: '600' }}>
                      {txn.confirmed}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#ef4444', fontWeight: '600' }}>
                      {txn.failed}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: rate >= 95 ? '#dcfce7' : '#fef3c7',
                        color: rate >= 95 ? '#16a34a' : '#d97706',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {rate}%
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

export default BlockchainAnalytics;