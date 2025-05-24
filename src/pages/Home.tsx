import { motion } from 'framer-motion';
import { InteractiveGridPattern } from '@/components/main/InteractiveGridPattern';
import { BoxReveal } from '@/components/main/BoxReveal';
import { SparklesText } from '@/components/main/SparkleText';
import Model from '@/components/main/Model';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
const Home = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const slideInFromLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const slideInFromRight = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1 } },
  };
  return (
    <main className="w-screen min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-surface-50 to-surface-100">
      <section className="flex flex-row items-center justify-center flex-wrap w-full min-h-screen">
        <InteractiveGridPattern>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col items-center w-full max-w-2xl backdrop-blur-3xl p-8 rounded-2xl border border-surface text-center z-30 perspective-origin-center hover:rotate-x-12 hover:rotate-y-12 hover:scale-105 transition-transform"
          >
            <BoxReveal>
              <h1 className="text-5xl font-bold mb-4">Welcome to <SparklesText text="Skilline"/></h1>
            </BoxReveal>
            <BoxReveal>
              <p className="text-lg mb-6">
                Unlock endless learning with Home! Explore expertly crafted courses, interactive content, and personalized progress tracking designed to fit your pace.
              </p>
            </BoxReveal>
            <BoxReveal>
              <div className="flex flex-row justify-between items-center gap-2 flex-wrap">
                <a href="/login" className="bg-blue-950 text-white py-2 px-4 rounded-lg font-semibold transition-all">Start Learning Now</a>
                <a href="/features" className="bg-transparent py-1 px-2 rounded-lg font-semibold view-all-button"><span>View All Features →</span></a>
              </div>
            </BoxReveal>
          </motion.div>
        <Canvas
          style={{
              borderRadius:"10px",
              height: "400px"
          }}
          className='min-w-[300px] max-w-2xl h-full'
          frameloop="always"
          shadows>
          <Suspense fallback={"loading"}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[0, 10, 5]} intensity={1} />
              <OrbitControls enableZoom={false} enableDamping={true}/>
              <Model/>
          </Suspense>
        </Canvas>
        </InteractiveGridPattern>
        </section>
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl px-4 py-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={slideInFromLeft}
              className="flex flex-col border border-surface shadow-lg justify-center items-center max-w-80 rounded-2xl p-8 gap-4 hover:scale-105 transition-transform"
            >
              <div className="rounded-full w-12 h-12 flex items-center justify-center">
                <i className="pi pi-book !text-2xl"></i>
              </div>
              <span className="text-2xl font-bold">Personal Learning</span>
              <span className="text-slate-700 text-center">
                Enhance your skills at your own pace with interactive flashcards!
              </span>
              <a href="#personal-learning" className="font-semibold hover:underline">Start Learning →</a>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={scaleUp}
              className="flex flex-col border border-surface shadow-lg justify-center items-center max-w-80 rounded-2xl p-8 gap-4 hover:scale-105 transition-transform"
            >
              <div className="rounded-full w-12 h-12 flex items-center justify-center">
                <i className="pi pi-pencil !text-2xl"></i>
              </div>
              <span className="text-2xl font-bold">Create Flashcards</span>
              <span className="text-slate-700 text-center">
                Make your own custom flashcards and track your progress.
              </span>
              <a href="#create-flashcards" className="font-semibold hover:underline">Get Started →</a>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={slideInFromRight}
              className="flex flex-col border border-surface shadow-lg justify-center items-center max-w-80 rounded-2xl p-8 gap-4 hover:scale-105 transition-transform"
            >
              <div className="rounded-full w-12 h-12 flex items-center justify-center">
                <i className="pi pi-chart-line !text-2xl"></i>
              </div>
              <span className="text-2xl font-bold">Track Your Progress</span>
              <span className="text-slate-700 text-center">
                Analyze your performance and achieve mastery over your subjects.
              </span>
              <a href="#track-progress" className="font-semibold hover:underline">View Progress →</a>
            </motion.div>
        </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-7xl px-4 py-20 bg-surface-50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          className="flex flex-col shadow-lg justify-center items-center max-w-80 rounded-2xl gap-4 p-1 hover:scale-105 transition-transform border-animation"
        >
          <div className="w-full h-full z-10 flex flex-col justify-center items-center gap-2 p-4 rounded-2xl feedback-container">
            <img src="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" alt="Avatar" className="brightness-75 scale-75 hover:brightness-100 hover:scale-100 rounded-full w-24 h-24" />
            <span className="text-2xl font-medium">Jenna Thompson</span>
            <span className="text-slate-700 text-center">"Home transformed the way I learn."</span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          className="flex flex-col shadow-lg justify-center items-center max-w-80 rounded-2xl gap-4 p-1 hover:scale-105 transition-transform border-animation"
        >
          <div className="w-full h-full z-10 flex flex-col justify-center items-center gap-2 p-4 rounded-2xl feedback-container">
            <img src="https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png" alt="Avatar" className="brightness-75 scale-75 hover:brightness-100 hover:scale-100 rounded-full w-24 h-24" />
            <span className="text-2xl font-medium">Isabel Garcia</span>
            <span className="text-slate-700 text-center">"The Flashcard App is a game-changer."</span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          className="flex flex-col shadow-lg justify-center items-center max-w-80 rounded-2xl gap-4 p-1 hover:scale-105 transition-transform border-animation"
        >
          <div className="w-full h-full z-10 flex flex-col justify-center items-center gap-2 p-4 rounded-2xl feedback-container">
            <img src="https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png" alt="Avatar" className="brightness-75 scale-75 hover:brightness-100 hover:scale-100 rounded-full w-24 h-24" />
            <span className="text-2xl font-medium">Xavier Mason</span>
            <span className="text-center text-slate-700">"Home Enterprise streamlined our training process."</span>
          </div>
        </motion.div>
      </div>
      <div className="flex flex-col items-center gap-8 w-screen py-20 bg-surface-50">
        <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={slideInFromLeft}
            className="flex flex-col border border-surface shadow-lg justify-center items-center max-w-80 rounded-2xl p-8 gap-4 hover:scale-105 transition-transform"
          >
            <span className="text-2xl font-bold">How do I get started?</span>
            <span className="text-slate-700 text-center">Sign up for free, choose a course, and start learning today!</span>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={slideInFromRight}
            className="flex flex-col border border-surface shadow-lg justify-center items-center max-w-80 rounded-2xl p-8 gap-4 hover:scale-105 transition-transform"
          >
            <span className="text-2xl font-bold">Is there a free trial?</span>
            <span className="text-center text-slate-700">Yes, we offer a 7-day free trial for all new users.</span>
          </motion.div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-8 w-screen py-20">
        <h2 className="text-4xl font-bold">Ready to Transform Your Learning?</h2>
        <p className="text-lg text-center max-w-2xl px-4 text-slate-700">Join Home today and unlock a world of knowledge, growth, and success.</p>
        <a href="/login" className="px-8 py-3 rounded-lg font-semibold hover:bg-surface-100 transition-all button">Get Started Now</a>
      </div>
    </main>
  );
};

export default Home;