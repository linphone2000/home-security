import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };
  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="relative flex-grow py-20 bg-transparent overflow-hidden flex flex-col items-center justify-center text-center px-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-200"
          variants={fadeInUp}
        >
          Intelligent Home Surveillance System
        </motion.h2>
        <motion.p
          className="mt-4 text-lg md:text-xl text-gray-800 dark:text-gray-300 max-w-2xl tracking-wide leading-7"
          variants={fadeInUp}
        >
          Real-time face recognition and object detection powered by
          TensorFlow.js and Next.js for enhanced privacy and security—right in
          your browser.
        </motion.p>
        <motion.p
          className="mt-3 text-base md:text-lg text-gray-700 dark:text-gray-400 max-w-2xl tracking-wide leading-6"
          variants={fadeInUp}
        >
          Dynamic switching between object detection and face recognition
          ensures efficient performance without external hardware.
        </motion.p>
        <motion.div
          className="mt-6 flex space-x-4 justify-center"
          variants={fadeInUp}
        >
          <Link href="/facecapture">
            <Button
              className="group relative overflow-hidden px-6 py-3 text-cyan-600 font-semibold 
                     rounded-md shadow-md bg-white dark:bg-gray-900 transition-all 
                     duration-500"
            >
              {/* Gradient overlay that expands on hover */}
              <span
                className="absolute inset-x-0 bottom-0 h-1/2 group-hover:h-full 
                       bg-gradient-to-t from-cyan-500/20 to-transparent 
                       dark:from-cyan-700/20 dark:to-transparent pointer-events-none 
                       transition-all duration-500"
                aria-hidden="true"
              />
              Learn More
            </Button>
          </Link>
          <Link href="/facecapture">
            <Button
              className="group relative overflow-hidden px-6 py-3 text-cyan-600 font-semibold 
                     rounded-md border border-cyan-600 dark:border-cyan-400 dark:text-cyan-400 
                     transition-all duration-500 bg-white dark:bg-gray-900"
            >
              {/* Gradient overlay that expands on hover */}
              <span
                className="absolute inset-x-0 bottom-0 h-1/2 group-hover:h-full 
                       bg-gradient-to-t from-cyan-500/20 to-transparent 
                       dark:from-cyan-700/20 dark:to-transparent pointer-events-none 
                       transition-all duration-500"
                aria-hidden="true"
              />
              Get Started
            </Button>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Hero;
