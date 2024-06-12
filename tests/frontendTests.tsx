function doubleInput(input: number): number {
  console.log("Performing expensive calculation");
  return input * 2; 
}

const memoizeFunction = (fn: (input: number) => number) => {
  const cache: Record<number, number> = {};
  return (...args: number[]) => {
    const input = args[0]; 
    if (input in cache) {
      console.log('Fetching from cache:', input);
      return cache[input];
    } else {
      console.log('Calculating result:', input);
      const result = fn(input);
      cache[input] = result;
      return result;
    }
  }
}

const memoizedDoubleInput = memoizeFunction(doubleInput);

import React, { useMemo } from 'react';

interface MyComponentProps {
  inputNumber: number;
}

const MyComponent: React.FC<MyComponentProps> = ({ inputNumber }) => {
  const memoizedResult = useMemo(() => memoizedDoubleInput(inputNumber), [inputNumber]);

  return (
    <div>
      <p>Computed Value: {memoizedResult}</p>
    </div>
  );
};