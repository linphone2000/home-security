import { motion } from "framer-motion";
import { Camera, ShieldCheck, UserCheck } from "lucide-react";

const Features = () => {
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
      {/* Features Section */}
      {/* Features Section */}
      <section
        id="features"
        className="py-12 bg-transparent dark:bg-transparent"
      >
        <div className="container mx-auto px-4">
          <motion.h3
            className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-200"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Key Features
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <Camera className="mx-auto mb-4 h-12 w-12 text-cyan-500 dark:text-cyan-400" />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                Real-Time Detection
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Detect and identify faces instantly with fast, browser-based AI
                processing.
              </p>
            </motion.div>
            {/* Feature 2 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-cyan-500 dark:text-cyan-400" />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                Enhanced Accuracy
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Reliable recognition with advanced models, minimizing false
                positives for secure performance.
              </p>
            </motion.div>
            {/* Feature 3 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <UserCheck className="mx-auto mb-4 h-12 w-12 text-cyan-500 dark:text-cyan-400" />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                Seamless Usability
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and monitor with ease using a clean and intuitive
                dashboard.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;
