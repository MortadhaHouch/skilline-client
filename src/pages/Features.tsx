import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Sample data for intro content
const introContent = [
  {
    title: "Interactive Learning",
    description: "Engage with interactive content that makes learning fun and effective.",
    icon: "📚",
  },
  {
    title: "Expert Instructors",
    description: "Learn from industry experts who are passionate about teaching.",
    icon: "👩‍🏫",
  },
  {
    title: "Flexible Scheduling",
    description: "Learn at your own pace with flexible course schedules.",
    icon: "⏰",
  },
  {
    title: "Community Support",
    description: "Join a vibrant community of learners and mentors.",
    icon: "🤝",
  },
];

// Testimonials data
const testimonials = [
  {
    name: "John Doe",
    role: "Student",
    comment: "Skilline has transformed the way I learn. The courses are engaging and easy to follow!",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Jane Smith",
    role: "Developer",
    comment: "The instructors are amazing, and the community is very supportive. Highly recommended!",
    image: "https://via.placeholder.com/150",
  },
];
// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};
const hoverVariants = {
  hover: { scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' },
  tap: { scale: 0.95 },
};

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <motion.main
      className="flex flex-col items-center justify-center w-screen min-h-screen bg-gradient-to-b"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.section
        className="w-full min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden"
        ref={ref}
      >
        <motion.div
          className="w-[clamp(320px,60%,450px)] flex flex-col justify-center items-center gap-6 bg-opacity-70 p-8 rounded-lg border border-gray-200 shadow-xl z-10"
          whileHover="hover"
          whileTap="tap"
          variants={hoverVariants}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-center text-gray-800">
            Welcome to Skilline
          </h2>
          <p className="text-lg text-center text-gray-600">
            Join us in creating engaging and interactive learning experiences
          </p>
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x1080')] bg-cover bg-center opacity-50"
          style={{ y }}
        />
      </motion.section>

      {/* Intro Content Sections */}
      <motion.section
        className="w-full flex flex-row justify-center items-center flex-wrap px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {introContent.map((item, index) => (
          <motion.div
            key={index}
            className="w-[clamp(320px,60%,450px)] flex flex-col justify-center items-center gap-4 bg-opacity-80 p-6 rounded-lg border border-gray-200 shadow-lg feature-container mb-8"
            whileHover="hover"
            whileTap="tap"
            variants={hoverVariants}
          >
            <motion.div
              className="text-4xl mb-4"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              {item.icon}
            </motion.div>
            <h3 className="text-xl md:text-3xl font-semibold text-gray-700">
              {item.title}
            </h3>
            <p className="text-base md:text-lg text-gray-600">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="w-full flex flex-col justify-center items-center px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-12">
          What Our Students Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center gap-4 bg-opacity-80 p-6 rounded-lg border border-gray-200 shadow-lg"
              whileHover="hover"
              whileTap="tap"
              variants={hoverVariants}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-24 h-24 rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700">
                {testimonial.name}
              </h3>
              <p className="text-base text-gray-600">{testimonial.role}</p>
              <p className="text-base text-gray-600 text-center">
                {testimonial.comment}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.main>
  );
};

export default Features;