import React, { useState, useEffect } from "react";

function CustomComponent() {
  return (
    <div>
      <h1>Component</h1>
    </div>
  );
}

// This is a comment test

const Counter = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="counter-widget">
      <h1>React Counter</h1>
      <p>
        Current count: <strong>{count}</strong>
      </p>
      <button onClick={handleIncrement}>Increment</button>
      <CustomComponent />
    </div>
  );
};

export default Counter;
