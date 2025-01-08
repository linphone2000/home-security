import { motion } from "framer-motion";

const HowItWorks = () => {
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
      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-12 bg-transparent dark:bg-transparent"
      >
        <div className="container mx-auto px-4">
          <motion.h3
            className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-200"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            How It Works
          </motion.h3>
          <motion.div
            className="flex flex-col md:flex-row items-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Step 1 */}
            <motion.div
              className="md:w-1/3 text-center md:pr-6 mb-8 md:mb-0"
              variants={fadeInUp}
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=crop&w=500&h=300&q=80"
                alt="Webcam Input"
                className="rounded-lg shadow-md mb-4"
              />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                1. Capture Input
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Use your webcam to provide a live video feed for face and object
                detection.
              </p>
            </motion.div>
            {/* Step 2 */}
            <motion.div
              className="md:w-1/3 text-center md:px-6 mb-8 md:mb-0"
              variants={fadeInUp}
            >
              <img
                src="https://d3caycb064h6u1.cloudfront.net/wp-content/uploads/2022/10/dataprocessing-scaled.jpg"
                alt="Data Processing"
                className="rounded-lg shadow-md mb-4"
              />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                2. Analyze Input
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Real-time analysis using TensorFlow.js to detect objects and
                recognize faces efficiently.
              </p>
            </motion.div>
            {/* Step 3 */}
            <motion.div
              className="md:w-1/3 text-center md:pl-6"
              variants={fadeInUp}
            >
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=crop&w=500&h=300&q=80"
                alt="Results Display"
                className="rounded-lg shadow-md mb-4"
              />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                3. Get Results
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                View real-time notifications and detailed outputs on detected
                faces and objects.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
