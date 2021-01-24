import { useEffect, useRef } from 'react';

/* eslint-disable-next-line @typescript-eslint/ban-types */
export const usePrevious: <T extends {}>(value: T) => any = <T extends {}>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};
export const useCompare = (val: any): boolean => {
    const prevVal = usePrevious(val);
    return prevVal !== val;
};
