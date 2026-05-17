import React from 'react';

function Loader() {
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Animated Market Growth Bars */}
        <div style={styles.chartContainer}>
          <div style={{ ...styles.bar, ...styles.bar1 }}></div>
          <div style={{ ...styles.bar, ...styles.bar2 }}></div>
          <div style={{ ...styles.bar, ...styles.bar3 }}></div>
          <div style={{ ...styles.bar, ...styles.bar4 }}></div>
        </div>
        
        {/* Professional Financial Loading Text */}
        <h3 style={styles.text}>Securing Connection</h3>
        <p style={styles.subtext}>Fetching real-time market data...</p>
      </div>

      {/* Injecting keyframes directly into the document */}
      <style>{`
        @keyframes growAndGlow {
          0%, 100% {
            height: 15px;
            opacity: 0.5;
            background-color: #0d9488; /* Teal-green */
          }
          50% {
            height: 45px;
            opacity: 1;
            background-color: #10b981; /* Vibrant Emerald Green */
            box-shadow: 0 0 12px #10b981;
          }
        }
      `}</style>
    </div>
  );
}

// Inline styling utilizing standard financial color palettes
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0a1128', // Deep Trust Navy background
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  wrapper: {
    textAlign: 'center',
  },
  chartContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '6px',
    height: '50px',
    marginBottom: '24px',
  },
  bar: {
    width: '6px',
    borderRadius: '3px',
    animation: 'growAndGlow 1.2s ease-in-out infinite',
  },
  // Staggering the animations to look like a rising market trend
  bar1: { animationDelay: '0.1s' },
  bar2: { animationDelay: '0.3s' },
  bar3: { animationDelay: '0.5s' },
  bar4: { animationDelay: '0.7s' },
  text: {
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    margin: '0 0 8px 0',
  },
  subtext: {
    color: '#64748b', // Soft Slate neutral gray
    fontSize: '0.85rem',
    margin: 0,
  },
};

export default Loader;