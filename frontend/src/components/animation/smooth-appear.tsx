import { motion, TargetAndTransition } from "framer-motion";

type SmoothAppearAnimationProps = {
  children: React.ReactNode;
  initial?: boolean | TargetAndTransition;
  animate?: TargetAndTransition;
  transition?: TargetAndTransition["transition"];
};

export default function SmoothAppearAnimation({
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 0.6, ease: "easeInOut" },
}: SmoothAppearAnimationProps) {
  return (
    <motion.div initial={initial} animate={animate} transition={transition}>
      {children}
    </motion.div>
  );
}
