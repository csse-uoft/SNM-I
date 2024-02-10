import {useEffect, useRef} from "react";

export function useDebounceEffect(func, dependencies, delayInMs) {
  const firstDebounce = useRef(true);

  useEffect(() => {
    // Do not wait for the first time
    if (func && firstDebounce.current) {
      firstDebounce.current = false;
      func();
      return;
    }

    const handler = setTimeout(func, delayInMs);

    return () => clearTimeout(handler);
  }, [func, ...dependencies, delayInMs]);

}
