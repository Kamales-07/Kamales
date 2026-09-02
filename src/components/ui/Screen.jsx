import { motion } from 'framer-motion'

/** Shared enter/exit choreography so every screen hands off the same way. */
export const screenVariants = {
  initial: { opacity: 0, y: 28, scale: 0.97, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    y: -22,
    scale: 0.97,
    filter: 'blur(6px)',
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
  },
}

export const itemVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function Screen({ children, className = '', ...rest }) {
  return (
    <motion.section
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative z-10 mx-auto w-full max-w-2xl px-4 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 ${className}`}
      {...rest}
    >
      {children}
    </motion.section>
  )
}

export function Item({ children, className = '', as: Tag = motion.div, ...rest }) {
  return (
    <Tag variants={itemVariants} className={className} {...rest}>
      {children}
    </Tag>
  )
}
