import { RefObject, useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill"

type Size = { width: number; height: number };

export default function useSize(
  targetRef: RefObject<HTMLElement>
): Size | undefined {
  const [state, setState] = useState<Size | undefined>(() => {
    const el = targetRef.current;
    return el ? { width: el.clientWidth, height: el.clientHeight } : undefined;
  });

  useEffect(() => {
    const el = targetRef.current;

    if (!el) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { clientWidth, clientHeight } = entry.target;
        setState({ width: clientWidth, height: clientHeight })
      })
    })

    resizeObserver.observe(el);

    return () => {
      resizeObserver.unobserve(el);
    }

  }, []);

  return state;
}
