"use client";
import React from "react";
import { Terminal, Camera, ShieldCheck, UserCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow bg-gradient-to-r py-10 from-blue-500 via-cyan-500 to-green-500 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white">
          Advanced Face Recognition System
        </h2>
        <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
          Utilize state-of-the-art TensorFlow models for accurate and real-time
          face recognition. Enhance your security and streamline user
          interactions effortlessly.
        </p>
        <div className="mt-6">
          <Button href="#features" className="mr-4">
            Learn More
          </Button>
          <Button variant="outline" href="#contact">
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-8">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <Camera className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <h4 className="text-xl font-semibold">Real-Time Detection</h4>
              <p className="mt-2 text-gray-600">
                Instantly recognize faces with our optimized TensorFlow models,
                ensuring quick and reliable performance.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="text-center">
              <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <h4 className="text-xl font-semibold">High Accuracy</h4>
              <p className="mt-2 text-gray-600">
                Achieve unparalleled accuracy in face recognition, reducing
                false positives and enhancing security measures.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="text-center">
              <UserCheck className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <h4 className="text-xl font-semibold">User-Friendly Interface</h4>
              <p className="mt-2 text-gray-600">
                Easily manage and monitor recognized faces through our intuitive
                dashboard, designed for seamless user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-8">How It Works</h3>
          <div className="flex flex-col md:flex-row items-center">
            {/* Step 1 */}
            <div className="md:w-1/3 text-center md:pr-6">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=crop&w=500&h=300&q=80"
                alt="Upload Image"
                className="rounded-lg shadow-md mb-4"
              />
              <h4 className="text-xl font-semibold">1. Upload Image</h4>
              <p className="mt-2 text-gray-600">
                Start by uploading an image or accessing your webcam for live
                face detection.
              </p>
            </div>
            {/* Step 2 */}
            <div className="md:w-1/3 text-center md:px-6">
              <img
                src="https://d3caycb064h6u1.cloudfront.net/wp-content/uploads/2022/10/dataprocessing-scaled.jpg"
                alt="Processing"
                className="rounded-lg shadow-md mb-4"
              />
              <h4 className="text-xl font-semibold">2. Process Data</h4>
              <p className="mt-2 text-gray-600">
                Our TensorFlow models analyze and recognize faces with high
                precision and speed.
              </p>
            </div>
            {/* Step 3 */}
            <div className="md:w-1/3 text-center md:pl-6">
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=crop&w=500&h=300&q=80"
                alt="Results"
                className="rounded-lg shadow-md mb-4"
              />
              <h4 className="text-xl font-semibold">3. View Results</h4>
              <p className="mt-2 text-gray-600">
                Access detailed reports and real-time notifications based on the
                recognition results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Enhance Your Security?
          </h3>
          <p className="mb-6">
            Integrate our advanced face recognition system into your application
            and experience unmatched security and efficiency.
          </p>
          <Button href="#contact">Get Started Now</Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 FaceRec TensorFlow. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
            <a href="/contact" className="hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
