import { motion } from "framer-motion";

import { TargetAndTransition, VariantLabels } from "framer-motion";

type AnimatedElementProps = {
  children: React.ReactNode;
  initial?: boolean | TargetAndTransition | VariantLabels;
  animate?: TargetAndTransition | VariantLabels;
  transition?: TargetAndTransition["transition"];
};

const AnimatedElement = ({
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 0.6, ease: "easeInOut" },
}: AnimatedElementProps) => {
  return (
    <motion.div initial={initial} animate={animate} transition={transition}>
      {children}
    </motion.div>
  );
};

export default AnimatedElement;
