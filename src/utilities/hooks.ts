import {useEffect, useRef } from 'react';

export const usePrevious = <T extends {}>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
export const useCompare = (val: any) => {
      const prevVal = usePrevious(val)
      return prevVal !== val
  }