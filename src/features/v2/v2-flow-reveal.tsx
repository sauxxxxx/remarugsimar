import { useInView } from "motion/react";
import { type ReactNode, useRef } from "react";
import styles from "./v2-mobile-experience.module.css";

export function V2FlowReveal({ children, className = "" }: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: "some" });

  return (
    <div ref={ref} className={`${className} ${visible ? styles.revealed : ""}`}>
      {children}
    </div>
  );
}
