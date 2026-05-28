import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { reveal, revealViewport } from "./motionConfig";

type ResponsiveMotionWrapperProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function ResponsiveMotionWrapper({
  children,
  ...props
}: ResponsiveMotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={props.className}>{children}</div>;
  }

  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      {...props}
    >
      {children}
    </motion.div>
  );
}
