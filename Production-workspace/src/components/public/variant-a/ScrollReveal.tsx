"use client";

import { useInViewOnce } from "./useInViewOnce";

type ScrollRevealProps = {
  children: React.ReactNode;
  as?: "section" | "div" | "article";
  id?: string;
  className?: string;
  visibleClassName?: string;
  hiddenClassName?: string;
  threshold?: number;
  style?: React.CSSProperties;
  "aria-labelledby"?: string;
};

export function ScrollReveal({
  children,
  as: Tag = "div",
  id,
  className = "",
  visibleClassName = "translate-y-0 opacity-100",
  hiddenClassName = "translate-y-10 opacity-0",
  threshold = 0.15,
  style,
  ...rest
}: ScrollRevealProps) {
  const { ref, isVisible } = useInViewOnce<HTMLElement>(threshold);
  const revealClassName = `transition-all duration-700 ease-out ${className} ${isVisible ? visibleClassName : hiddenClassName}`;

  if (Tag === "section") {
    return (
      <section
        ref={ref as React.Ref<HTMLElement>}
        id={id}
        style={style}
        className={revealClassName}
        {...rest}
      >
        {children}
      </section>
    );
  }

  if (Tag === "article") {
    return (
      <article
        ref={ref as React.Ref<HTMLElement>}
        id={id}
        style={style}
        className={revealClassName}
        {...rest}
      >
        {children}
      </article>
    );
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      style={style}
      className={revealClassName}
      {...rest}
    >
      {children}
    </div>
  );
}
