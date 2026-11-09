"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

export interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  children: ReactNode;
}

export function Reveal({ delay = 0, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
