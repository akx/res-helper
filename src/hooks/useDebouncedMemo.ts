import React, { DependencyList } from "react";

export default function useDebouncedMemo<T>(
  callback: () => T,
  deps: DependencyList,
  getDelay: (oldDeps: DependencyList, newDeps: DependencyList) => number,
) {
  const [value, setValue] = React.useState<T>(callback());
  const lastDeps = React.useRef<DependencyList>([]);
  React.useEffect(() => {
    const ms = getDelay(lastDeps.current, deps);
    const timeout = setTimeout(() => {
      const val = callback();
      lastDeps.current = [...deps];
      setValue(val);
    }, ms);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}
