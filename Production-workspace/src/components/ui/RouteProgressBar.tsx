"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function RouteProgressBar() {
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let current = 18;
    const frameId = window.requestAnimationFrame(() => {
      setVisible(true);
      setProgress(current);
    });

    const rampTimer = window.setInterval(() => {
      current = Math.min(current + 7, 78);
      setProgress(current);
    }, 70);

    let hideTimer = 0;

    const completeTimer = window.setTimeout(() => {
      window.clearInterval(rampTimer);
      setProgress(100);

      hideTimer = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 180);
    }, 420);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearInterval(rampTimer);
      window.clearTimeout(completeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80]">
      <div
        aria-hidden="true"
        className="h-0.5 origin-left bg-[#C9A94E] transition-[transform,opacity] duration-200 ease-out"
        style={{
          transform: `scaleX(${progress / 100})`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}