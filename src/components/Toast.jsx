import React from 'react';

function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: 32,
      background: '#111',
      color: '#fff',
      padding: '10px 24px',
      borderRadius: '10px',
      zIndex: 9999,
      fontSize: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,.12)'
    }}>
      {message}
    </div>
  );
}

export default Toast;
