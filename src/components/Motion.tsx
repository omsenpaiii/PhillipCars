"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const FadeIn: React.FC<MotionWrapperProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FadeInStagger: React.FC<HTMLMotionProps<"div">> = ({ children, ...props }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FadeInStaggerItem: React.FC<HTMLMotionProps<"div">> = ({ children, ...props }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn: React.FC<MotionWrapperProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn: React.FC<MotionWrapperProps & { direction?: "left" | "right" }> = ({
  children,
  delay = 0,
  duration = 0.6,
  direction = "left",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
