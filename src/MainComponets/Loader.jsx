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

      {/* Injecting keyframes with matching reddish-orange dashboard accents */}
      <style>{`
        @keyframes growAndGlow {
          0%, 100% {
            height: 15px;
            opacity: 0.4;
            background-color: #a64633;
          }
          50% {
            height: 45px;
            opacity: 1;
            background-color: #c45a45; 
            box-shadow: 0 0 14px rgba(196, 90, 69, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#171515', // Matches the deep, warm dark background of your dashboard
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
    color: '#9e9593', // Muted text tone pulled from your side-menu inactive items
    fontSize: '0.85rem',
    margin: 0,
  },
};

export default Loader;