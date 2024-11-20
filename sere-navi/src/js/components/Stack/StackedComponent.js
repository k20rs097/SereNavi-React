import React from 'react';

const StackedComponent = ({ children, index ,allowPointerEvents = false}) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: index,
      pointerEvents: allowPointerEvents ? 'auto' : 'none'
    }}>
      {children}
    </div>
  );
};

export default StackedComponent;