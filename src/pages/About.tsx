import React from 'react';
import { motion } from 'framer-motion';

// Sample data for testimonials
const testimonials = [
  {
    name: 'John Doe',
    text: 'Skilline has completely changed the way I learn. The games are fun and educational!',
  },
  {
    name: 'Jane Smith',
    text: 'I love the multiplayer mode. Learning with friends has never been this engaging.',
  },
  {
    name: 'Alice Johnson',
    text: 'The achievements system keeps me motivated to learn more every day.',
  },
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const cardAnimation = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <motion.div
        className="about-hero p-8 bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center rounded-xl shadow-lg mb-8"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h1 className="text-5xl font-bold leading-tight">About Skilline</h1>
        <p className="mt-4 text-xl">
          An educational journey through the world of card games, making learning fun!
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        className="p-8 shadow-xl rounded-xl mb-8"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-semibold mb-4 text-blue-800">Our Mission</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Skilline aims to provide an immersive learning experience by combining the thrill of card games with
          educational content. Whether you're learning strategy, math, or history, we aim to bring education to life
          in a fun, interactive environment.
        </p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="p-8 shadow-xl rounded-xl mb-8"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-semibold mb-6 text-blue-800">Features</h2>
        <p className="text-lg mb-6 text-gray-600">
          Skilline offers a variety of interactive and engaging features:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {['Interactive Games', 'Customizable Learning', 'Multiplayer Support'].map((feature, index) => (
            <motion.div
              key={index}
              variants={cardAnimation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="p-6 rounded-lg border border-gray-200 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <i className="pi pi-gamepad text-2xl text-blue-600"></i>
                  <span className="font-semibold">{feature}</span>
                </div>
                <p className="text-gray-700">
                  {feature === 'Interactive Games'
                    ? 'Experience educational content in a fun and engaging way through card games.'
                    : feature === 'Customizable Learning'
                    ? 'Tailor learning paths to match personal preferences and learning styles.'
                    : 'Learn with friends or join educational groups for collaborative learning.'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Game Modes Section */}
      <motion.div
        className="p-8 shadow-xl rounded-xl mb-8"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-semibold mb-6 text-blue-800">Game Modes</h2>
        <p className="text-lg text-gray-700 mb-6">
          Skilline offers various game modes to cater to different learning needs. Whether you’re looking for a
          competitive experience or a relaxed, solo learning session, we’ve got you covered.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {['Competitive', 'Solo Play', 'Team Challenge'].map((mode, index) => (
            <motion.div
              key={index}
              variants={cardAnimation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="p-6 rounded-lg border border-gray-200 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <i className="pi pi-trophy text-2xl text-blue-600"></i>
                  <span className="font-semibold">{mode}</span>
                </div>
                <p className="text-gray-700">
                  {mode === 'Competitive'
                    ? 'Compete against others in a fun, skill-building game mode to test your knowledge and strategy.'
                    : mode === 'Solo Play'
                    ? 'Learn at your own pace by playing solo, focusing on individual skills and knowledge.'
                    : 'Join a team and collaborate to solve challenges and score the highest points.'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        className="p-8 shadow-xl rounded-xl mb-8"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-semibold mb-6 text-blue-800">Achievements</h2>
        <p className="text-lg mb-6 text-gray-600">
          Earn achievements and badges as you progress through the game. Challenge yourself to unlock all levels!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {['Master', 'Strategist', 'Collaborator', 'Achievement Unlocked'].map((achievement, index) => (
            <motion.div
              key={index}
              variants={cardAnimation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="p-6 rounded-lg border border-gray-200 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <i className="pi pi-star text-2xl text-blue-600"></i>
                  <span className="font-semibold">{achievement}</span>
                </div>
                <p className="text-gray-700">
                  {achievement === 'Master'
                    ? 'Earn the highest score in the competitive mode.'
                    : achievement === 'Strategist'
                    ? 'Successfully win a game using only strategy-based gameplay.'
                    : achievement === 'Collaborator'
                    ? 'Complete a challenge as part of a team.'
                    : 'Unlock all achievements to become a Skilline master.'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        className="p-8 shadow-xl rounded-xl mb-8"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-semibold mb-6 text-blue-800">What People Are Saying</h2>
        <div className="flex flex-row justify-center items-center flex-wrap gap-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="w-[clamp(320px,60%,450px)] p-6 rounded-lg shadow-xl bg-gradient-to-r from-blue-50 to-white"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-semibold text-blue-800">{testimonial.name}</p>
              <p className="text-gray-700">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        className="p-8 shadow-xl rounded-xl mb-8"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-semibold mb-6 text-blue-800">Contact Us</h2>
        <p className="text-lg mb-6 text-gray-700">
          If you have any questions, feel free to reach out to us! We're happy to help.
        </p>
        <div className="flex space-x-6 mt-6">
          <motion.button
            className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-md hover:scale-105 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Email Us
          </motion.button>
          <motion.button
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-md hover:scale-105 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Call Us
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default About;