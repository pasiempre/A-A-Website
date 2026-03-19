"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewOnce<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible || !ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.25,
        ...options,
      },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible, options]);

  return { ref, isVisible };
}
