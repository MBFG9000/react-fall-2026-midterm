import { useEffect, useState } from 'react';

export default function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cleanup: cancel the pending update when value changes
  }, [value, delay]);

  return debounced;
}
