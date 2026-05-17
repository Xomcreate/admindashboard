import React from 'react';

// Sample financial transaction data
const mockWithdrawals = [
  { id: 'TXN-9082', date: '2026-05-14', method: 'Bank Wire (Chase)', amount: '$5,000.00', status: 'Completed' },
  { id: 'TXN-8741', date: '2026-05-12', method: 'ACH Transfer', amount: '$1,250.00', status: 'Processing' },
  { id: 'TXN-8610', date: '2026-05-08', method: 'Crypto (USDC)', amount: '$10,400.00', status: 'Completed' },
  { id: 'TXN-8402', date: '2026-05-02', method: 'Bank Wire (BoA)', amount: '$250.00', status: 'Failed' },
];

function WithdrawalTable() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Table Header Section */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Withdrawal History</h2>
            <p style={styles.subtitle}>Review and track your recent fund transfers.</p>
          </div>
          <button style={styles.exportBtn}>Export CSV</button>
        </div>

        {/* Responsive Table Wrapper */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={{ ...styles.th, textAlign: 'left' }}>Transaction ID</th>
                <th style={{ ...styles.th, textAlign: 'left' }}>Date</th>
                <th style={{ ...styles.th, textAlign: 'left' }}>Method</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockWithdrawals.map((txn) => (
                <tr key={txn.id} style={styles.tr}>
                  <td style={{ ...styles.td, ...styles.txnId }}>{txn.id}</td>
                  <td style={{ ...styles.td, color: '#94a3b8' }}>{txn.date}</td>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{txn.method}</td>
                  <td style={{ ...styles.td, ...styles.amount }}>{txn.amount}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span style={{
                      ...styles.badge,
                      ...styles.statusColor(txn.status)
                    }}>
                      {txn.status}
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

// Premium Financial UI Styles
const styles = {
  container: {
    backgroundColor: '#0a1128', // Deep Navy base
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: '#111c44', // Lighter navy layer for contrast
    borderRadius: '12px',
    border: '1px solid #1e295d',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #1e295d',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.3px',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#64748b', // Soft slate
    margin: '4px 0 0 0',
  },
  exportBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #334155',
    color: '#94a3b8',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tableWrapper: {
    overflowX: 'auto', // Ensures responsiveness on mobile devices
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  thRow: {
    backgroundColor: '#0f1a3e',
  },
  th: {
    padding: '14px 24px',
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #1e295d',
  },
  tr: {
    borderBottom: '1px solid #1e295d',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#172554', // Subtle highlight on hover
    }
  },
  td: {
    padding: '16px 24px',
    color: '#e2e8f0',
    whiteSpace: 'nowrap',
  },
  txnId: {
    fontFamily: 'monospace',
    color: '#38bdf8', // Light blue accent for IDs
    fontWeight: '500',
  },
  amount: {
    textAlign: 'right',
    fontWeight: '600',
    letterSpacing: '0.3px',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  // Dynamic status styling mapping financial intent to color psychology
  statusColor: (status) => {
    switch (status) {
      case 'Completed':
        return { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }; // Emerald Green
      case 'Processing':
        return { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }; // Amber Warning
      case 'Failed':
      default:
        return { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }; // Red Error
    }
  }
};

export default WithdrawalTable;