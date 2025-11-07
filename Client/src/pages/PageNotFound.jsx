import { motion } from "framer-motion";

const PageNotFound = () => {
  const handleRedirect = () => {
    window.location.href = "/";
  };

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const numberVariants = {
    initial: {
      y: -50,
      rotate: 0,
      opacity: 0,
    },
    animate: (custom) => ({
      y: 0,
      rotate: custom.rotation,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        mass: 1.2,
        delay: custom.delay,
        duration: 2,
      },
    }),
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Large 404 background text*/}
      <div className="absolute bottom-8 right-8 flex items-end justify-end">
        <div
          className="font-bold select-none pointer-events-none flex opacity-30"
          style={{ fontSize: "clamp(200px, 30vw, 400px)", lineHeight: "1" }}
        >
          <motion.span
            className="txt"
            variants={numberVariants}
            initial="initial"
            animate="animate"
            custom={{ rotation: -8, delay: 0.1 }}
          >
            4
          </motion.span>
          <motion.span
            className="txt-dim"
            variants={numberVariants}
            initial="initial"
            animate="animate"
            custom={{ rotation: 3, delay: 0.2 }}
          >
            0
          </motion.span>
          <motion.span
            className="txt"
            variants={numberVariants}
            initial="initial"
            animate="animate"
            custom={{ rotation: -5, delay: 0.3 }}
          >
            4
          </motion.span>
        </div>
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-6 mb-32"
        variants={containerVariants}
      >
        <motion.h1
          className="text-5xl xl:text-6xl font-bold txt mb-2 xl:mb-4"
          variants={itemVariants}
        >
          OOPS!
        </motion.h1>

        <motion.p
          className="text-md xl:text-xl txt-disabled mb-4 xl:mb-8 font-medium"
          variants={itemVariants}
        >
          This page cannot be found
        </motion.p>

        <motion.button
          onClick={handleRedirect}
          className="btn hover:btn-hover text-white px-5 py-2 xl:px-6 xl:py-3 rounded-full font-semibold shadow-lg relative overflow-hidden transition-colors"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.span
            className="relative z-10"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            Back to home →
          </motion.span>
          <motion.div
            className="absolute inset-0 btn"
            initial={{ scaleX: 0, originX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PageNotFound;
