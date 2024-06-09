function expensiveCalculation(input: number): number {
  console.log("Performing expensive calculation");
  return input * 2; 
}

const memoize = (fn: Function) => {
  const cache = {};
  return (...args: any[]) => {
    const n = args[0]; 
    if (n in cache) {
      console.log('Fetching from cache:', n);
      return cache[n];
    }
    else {
      console.log('Calculating result:', n);
      const result = fn(n);
      cache[n] = result;
      return result;
    }
  }
}

const cachedExpensiveCalculation = memoize(expensiveCalculation);

import React, { useMemo } from 'react';

const MyComponent = ({ inputNumber }) => {
  const memoizedValue = useMemo(() => expensiveCalculation(inputNumber), [inputNumber]);

  return (
    <div>
      <p>Computed Value: {memoizedValue}</p>
    </div>
  );
};