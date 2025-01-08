import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
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
      <motion.section
        className="py-12 text-center bg-transparent dark:bg-transparent"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-200">
            Ready to Enhance Your Security?
          </h3>
          <p className="mb-6 text-gray-700 dark:text-gray-400 max-w-2xl mx-auto">
            Protect your home with real-time face recognition and object
            detection. Stay informed and secure, all within your browser.
          </p>
          <Link href="https://lpmz-portfolio.vercel.app/">
            <Button
              className="group relative overflow-hidden px-6 py-3 text-cyan-600 font-semibold 
               rounded-md shadow-md bg-white dark:bg-gray-900 transition-all duration-500"
            >
              {/* Gradient overlay that appears on hover */}
              <span
                className="absolute inset-x-0 bottom-0 h-0 dark:h-1/2 group-hover:h-full 
                 bg-gradient-to-t from-cyan-500/20 to-transparent 
                 dark:from-cyan-700/20 dark:to-transparent pointer-events-none 
                 transition-all duration-500"
                aria-hidden="true"
              />
              Get Started Now
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default CallToAction;
