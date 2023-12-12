import React, { DependencyList } from "react";

export default function useDebouncedMemo<T>(
  callback: () => T,
  deps: DependencyList,
  ms: number,
) {
  const [value, setValue] = React.useState<T>(callback());
  React.useEffect(() => {
    const timeout = setTimeout(() => setValue(callback()), ms);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}
