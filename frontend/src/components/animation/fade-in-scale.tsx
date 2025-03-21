"use client";
import { motion } from "motion/react";
import { ReactNode } from "react";

type FadeInScaleProps = {
  children: ReactNode;
  delay?: number;
};

const FadeInScale = ({ children, delay = 0, ...rest }: FadeInScaleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, transformOrigin: "center"}}
      transition={{
        duration: 0.3,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        delay: delay,
      }}
      viewport={{ once: false, amount: 0 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default FadeInScale;
