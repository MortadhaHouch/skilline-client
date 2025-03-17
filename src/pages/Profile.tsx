import { useEffect, useState } from 'react';
import { Post, User } from '../../utils/types';
import { useCookies } from 'react-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import fetchData from '../../utils/fetchData';
import { FaUser, FaEnvelope, FaIdBadge, FaCalendar, FaEdit, FaThumbsUp, FaThumbsDown, FaComment, FaFileAlt, FaUsers, FaQuestionCircle } from 'react-icons/fa';
import { IoIosStats } from 'react-icons/io';
import { RiLoader4Line } from 'react-icons/ri';
import ReactApexChart from 'react-apexcharts';

const chartOptions = {
  chart: {
    height: 390,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 270,
      hollow: {
        margin: 5,
        size: '30%',
        background: 'transparent',
        image: undefined,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        },
      },
      barLabels: {
        enabled: true,
        useSeriesColors: true,
        offsetX: -8,
        fontSize: '16px'
      },
    },
  },
  colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7'],
  labels: ['EASY', 'MEDIUM', 'HARD'],
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          show: false,
        },
      },
    },
  ],
};

export default function Profile() {
  const [cookies] = useCookies(['auth_token']);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<User & {
    stats: {
      bio: string;
      createdAt: string;
      updatedAt: string;
      interests: string[];
      posts: number;
      latestPosts: Post[];
      comments: number;
      index: number;
      mostRelevantPosts: { likes: number; dislikes: number; comments: number }[];
      dislikedPosts: number;
      likedPosts: number;
      administratedCommunities: number;
      communities: number;
      createdQuizzes: number;
      challenges: {
        _id: {
          months: number;
        };
      }[];
    };
  }| null>(null);

  const handleFetchData = async () => {
    try {
      setLoading(true);
      const request = await fetchData('/user/stats', 'GET', cookies.auth_token, '', 'json', 'json');
      if (request.data) {
        setUserStats(request.data);
        console.log(request.data.challenges);
        console.log(userStats?.stats.challenges);
        
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="flex flex-col items-center justify-start w-screen min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
      {loading ? (
        <motion.div
          className="flex items-center justify-center h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <RiLoader4Line className="animate-spin text-4xl text-blue-500 dark:text-blue-300" />
        </motion.div>
      ) : (
        <AnimatePresence>
          {userStats && (
            <motion.div
              className="w-[80%] max-w-7xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Header Section */}
              <motion.header
                className="grid grid-cols-[100px_1fr_1fr] grid-rows-[50px_50px] gap-4 backdrop-blur-md p-8 rounded-lg shadow-lg border border-gray-200 bg-white dark:bg-gray-800"
                variants={itemVariants}
              >
                <div className="row-span-2 col-start-1 row-start-1">
                  {userStats.avatar ? (
                    <motion.img
                      src={userStats.avatar}
                      className="w-full h-full rounded-full object-cover"
                      alt="User Avatar"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.p
                      className="w-full h-full rounded-full bg-gray-400 flex justify-center items-center text-3xl select-none"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {userStats.firstName.charAt(0).toUpperCase()}
                      {userStats.lastName.charAt(0).toUpperCase()}
                    </motion.p>
                  )}
                </div>
                <h2 className="text-3xl col-start-2 row-start-1 col-span-2 font-semibold text-blue-900 dark:text-blue-300">
                  Profile
                </h2>
                <p className="text-2xl col-span-2 row-start-2 col-start-2 font-semibold text-blue-900 dark:text-blue-300 opacity-80">
                  {userStats.firstName} {userStats.lastName}
                </p>
              </motion.header>

              {/* User Details Section */}
              <motion.section
                className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-500 dark:text-blue-300" size={45} /> User Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Name', value: `${userStats.firstName} ${userStats.lastName}`, icon: <FaUser size={45} /> },
                    { label: 'Email', value: userStats.email, icon: <FaEnvelope size={45} /> },
                    { label: 'Role', value: userStats.role, icon: <FaIdBadge size={45} /> },
                    { label: 'Joined Date', value: userStats.stats?.createdAt, icon: <FaCalendar size={45} /> },
                  ].map((detail, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-blue-500 dark:text-blue-300">{detail.icon}</span>
                      <div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{detail.label}</p>
                        <p className="text-lg text-gray-900 dark:text-gray-100">{detail.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Bio Section */}
              <motion.section
                className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <FaEdit className="text-blue-500 dark:text-blue-300" size={45} /> Bio
                </h2>
                <p className="text-lg text-gray-900 dark:text-gray-100">{userStats.stats?.bio}</p>
              </motion.section>

              {/* Activity Section */}
              <motion.section
                className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <IoIosStats className="text-blue-500 dark:text-blue-300" /> Activity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Posts', value: userStats.stats?.posts || 0, icon: <FaFileAlt size={45} /> },
                    { label: 'Comments', value: userStats.stats?.comments || 0, icon: <FaComment size={45} /> },
                    { label: 'Liked Posts', value: userStats.stats?.likedPosts || 0, icon: <FaThumbsUp size={45} /> },
                    { label: 'Disliked Posts', value: userStats.stats?.dislikedPosts || 0, icon: <FaThumbsDown size={45} /> },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-blue-500 dark:text-blue-300">{activity.icon}</span>
                      <div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{activity.label}</p>
                        <p className="text-lg text-gray-900 dark:text-gray-100">{activity.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Communities and Quizzes Section */}
              <motion.section
                className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <FaUsers className="text-blue-500 dark:text-blue-300" size={45} /> Communities & Quizzes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Administrated Communities', value: userStats.stats?.administratedCommunities || 0, icon: <FaUsers size={45} /> },
                    { label: 'Communities', value: userStats.stats?.communities || 0, icon: <FaUsers size={45} /> },
                    { label: 'Created Quizzes', value: userStats.stats?.createdQuizzes || 0, icon: <FaQuestionCircle size={45} /> },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-blue-500 dark:text-blue-300">{activity.icon}</span>
                      <div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{activity.label}</p>
                        <p className="text-lg text-gray-900 dark:text-gray-100">{activity.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Challenges Section */}
              <motion.section
                className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <IoIosStats className="text-blue-500 dark:text-blue-300" /> Challenges
                </h2>
                {userStats.stats.challenges ? (
                  <ReactApexChart
                    options={chartOptions}
                    series={userStats.stats.challenges.map((c) => c._id.months)}
                    type="radialBar"
                    height={390}
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-gray-100">No challenges completed yet.</p>
                )}
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </main>
  );
}