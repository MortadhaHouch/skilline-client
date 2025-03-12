import React, { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <main className="contact-container flex flex-col justify-center items-center gap-2 p-6">

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="hero-section text-center"
      >
        <h1 className="text-4xl font-semibold">Contact Us</h1>
        <p className="mt-4 text-lg">
          We'd love to hear from you! Whether you have questions, feedback, or
          just want to say hello, feel free to reach out.
        </p>
      </motion.div>

      {/* Contact Form Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Form Container */}
        <div className="form-container p-6 rounded-lg shadow-lg flex flex-col justify-start items-center gap-2">
          <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
          <p className="text-lg mb-4">
            Fill out the form below and we’ll get back to you as soon as
            possible!
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="border-solid border-[2px] focus:ring-2 focus:ring-blue-600 p-2 rounded-md focus:outline-none w-full transition-all ease-in-out duration-200 border-blue-400"
          />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="border-solid border-[2px] focus:ring-2 focus:ring-blue-600 p-2 rounded-md focus:outline-none w-full transition-all ease-in-out duration-200 border-blue-400"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="border-solid border-[2px] focus:ring-2 focus:ring-blue-600 p-2 rounded-md focus:outline-none w-full transition-all ease-in-out duration-200 border-blue-400"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message"
            className="border-solid border-[2px] focus:ring-2 focus:ring-blue-600 p-2 rounded-md focus:outline-none w-full transition-all ease-in-out duration-200 border-blue-400"
          ></textarea>
          <button
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-all ease-in-out duration-200"
          >
            Send Message
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default Contact;