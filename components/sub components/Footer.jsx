const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-gradient-to-t from-cyan-50 via-white to-white dark:bg-gradient-to-b dark:from-[hsl(219.13,41.82%,10.78%)] dark:to-cyan-950/30 
             text-gray-900 dark:text-gray-200 py-6"
    >
      <hr className="mb-4 w-1/2 mx-auto opacity-50"></hr>
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Lin Phone Myint Zaw. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a
            href="/privacy"
            className="hover:underline hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:underline hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="hover:underline hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
