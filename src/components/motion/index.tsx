"use client";

/**
 * Framer Motion wrappers.
 *
 * Framer Motion components are client-only. Re-exporting them from a single
 * `"use client"` module lets Server Components import ready-to-use motion
 * primitives without each file needing its own client boundary, and gives us
 * one place to tweak defaults (easing, durations) later.
 */
export {
  motion,
  AnimatePresence,
  LazyMotion,
  domAnimation,
  useReducedMotion,
  type Variants,
  type Transition,
} from "framer-motion";

import {
  motion,
  type HTMLMotionProps,
  type Variants,
  type Transition,
} from "framer-motion";

/** Shared easing/duration defaults for consistent motion across the app. */
export const transitions = {
  fast: { duration: 0.15, ease: "easeOut" },
  base: { duration: 0.25, ease: "easeOut" },
  slow: { duration: 0.4, ease: "easeInOut" },
} satisfies Record<string, Transition>;

/** A common fade-and-rise entrance used by cards, sections, and lists. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/** Stagger container to animate children in sequence. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/**
 * `FadeIn` — a thin convenience wrapper that fades and rises its children
 * into view on mount. Accepts all motion props so callers can override.
 */
export function FadeIn({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={transitions.base}
      {...props}
    >
      {children}
    </motion.div>
  );
}
