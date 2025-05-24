import { useEffect, useState } from 'react';
import { Post, User } from '../../utils/types';
import { useCookies } from 'react-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import fetchData from '../../utils/fetchData';
import { 
  FaUser, 
  FaEnvelope, 
  FaIdBadge, 
  FaCalendar, 
  FaEdit, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaComment, 
  FaFileAlt, 
  FaUsers, 
  FaQuestionCircle 
} from 'react-icons/fa';
import { IoIosStats } from 'react-icons/io';
import { RiLoader4Line } from 'react-icons/ri';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';

const chartOptions = {
  chart: {
    height: 390,
    type: 'radialBar',
    toolbar: {
      show: false
    }
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
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '22px',
        },
        value: {
          show: true,
          fontSize: '16px',
          formatter: (val: number) => `${val}`,
        },
      },
      barLabels: {
        enabled: true,
        useSeriesColors: true,
        offsetX: -8,
        fontSize: '16px',
      },
    },
  },
  colors: ['#F44336', '#E91E63', '#9C27B0'],
  labels: ['EASY', 'MEDIUM', 'HARD'],
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '14px',
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
};

export default function Profile() {
  const [cookies] = useCookies(['auth_token']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          month: number;
          difficulty?: string; // Added for better chart mapping
        };
        count: number;
      }[];
    };
  } | null>(null);
  const navigate = useNavigate();

  const handleFetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const request = await fetchData(
        '/user/stats',
        'GET',
        {},
        cookies.auth_token,
        'json',
        'json'
      );
      
      if (request.data) {
        // Ensure challenges data fits the chart (assuming 3 difficulty levels)
        const challengesByDifficulty = {
          EASY: 0,
          MEDIUM: 0,
          HARD: 0,
        };
        
        request.data.stats.challenges.forEach((challenge: any) => {
          const difficulty = challenge._id.difficulty?.toUpperCase() || 'EASY'; // Default to EASY if not specified
          if (challengesByDifficulty.hasOwnProperty(difficulty)) {
            challengesByDifficulty[difficulty] += challenge.count;
          }
        });

        setUserStats({
          ...request.data,
          stats: {
            ...request.data.stats,
            challenges: Object.entries(challengesByDifficulty).map(([difficulty, count]) => ({
              _id: { difficulty, month: 0 }, // month not used in radial chart
              count: count as number,
            })),
          },
        });
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cookies.auth_token) {
      navigate('/login');
    } else {
      handleFetchData();
    }
  }, [cookies.auth_token, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
          <span className="ml-2 text-gray-700 dark:text-gray-300">Loading profile...</span>
        </motion.div>
      ) : error ? (
        <motion.div
          className="flex flex-col items-center justify-center h-screen text-red-500 dark:text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{error}</p>
          <button
            onClick={handleFetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </motion.div>
      ) : (
        <AnimatePresence>
          {userStats && (
            <motion.div
              className="w-full max-w-7xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Header Section */}
              <motion.header
                className="grid grid-cols-[100px_1fr_auto] gap-4 p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                variants={itemVariants}
              >
                <div className="row-span-2">
                  {userStats.avatar ? (
                    <motion.img
                      src={userStats.avatar}
                      className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 dark:border-blue-300"
                      alt="User Avatar"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gray-400 dark:bg-gray-600 flex justify-center items-center text-3xl text-white select-none border-2 border-blue-500 dark:border-blue-300"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {userStats.firstName.charAt(0).toUpperCase()}
                      {userStats.lastName.charAt(0).toUpperCase()}
                    </motion.div>
                  )}
                </div>
                <h2 className="text-3xl font-semibold text-blue-900 dark:text-blue-300">
                  {userStats.firstName} {userStats.lastName}
                </h2>
                <button
                  onClick={() => navigate('/dashboard/settings')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </button>
                <p className="col-span-2 text-lg text-gray-600 dark:text-gray-400">
                  @{userStats.email.split('@')[0]}
                </p>
              </motion.header>

              {/* User Details Section */}
              <motion.section
                className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-6 flex items-center gap-2">
                  <FaUser className="text-blue-500 dark:text-blue-300" /> User Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', value: `${userStats.firstName} ${userStats.lastName}`, icon: <FaUser /> },
                    { label: 'Email', value: userStats.email, icon: <FaEnvelope /> },
                    { label: 'Role', value: userStats.role, icon: <FaIdBadge /> },
                    { label: 'Joined', value: new Date(userStats.stats?.createdAt || '').toLocaleDateString(), icon: <FaCalendar /> },
                  ].map((detail, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-blue-500 dark:text-blue-300 text-2xl">{detail.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">{detail.label}</p>
                        <p className="text-lg text-gray-900 dark:text-gray-100">{detail.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Bio and Interests Section */}
              <motion.section
                className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-6 flex items-center gap-2">
                  <FaEdit className="text-blue-500 dark:text-blue-300" /> About
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">Bio</p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">
                      {userStats.stats?.bio || 'No bio provided yet.'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">Interests</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userStats.stats?.interests?.length > 0 ? (
                        userStats.stats.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No interests added.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Activity Section */}
              <motion.section
                className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-6 flex items-center gap-2">
                  <IoIosStats className="text-blue-500 dark:text-blue-300" /> Activity
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Posts', value: userStats.stats?.posts || 0, icon: <FaFileAlt /> },
                    { label: 'Comments', value: userStats.stats?.comments || 0, icon: <FaComment /> },
                    { label: 'Likes Given', value: userStats.stats?.likedPosts || 0, icon: <FaThumbsUp /> },
                    { label: 'Dislikes Given', value: userStats.stats?.dislikedPosts || 0, icon: <FaThumbsDown /> },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-blue-500 dark:text-blue-300 text-2xl">{activity.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">{activity.label}</p>
                        <p className="text-lg text-gray-900 dark:text-gray-100">{activity.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Communities and Quizzes Section */}
              <motion.section
                className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-6 flex items-center gap-2">
                  <FaUsers className="text-blue-500 dark:text-blue-300" /> Communities & Quizzes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: 'Admin Communities', value: userStats.stats?.administratedCommunities || 0, icon: <FaUsers /> },
                    { label: 'Joined Communities', value: userStats.stats?.communities || 0, icon: <FaUsers /> },
                    { label: 'Created Quizzes', value: userStats.stats?.createdQuizzes || 0, icon: <FaQuestionCircle /> },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-blue-500 dark:text-blue-300 text-2xl">{activity.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">{activity.label}</p>
                        <p className="text-lg text-gray-900 dark:text-gray-100">{activity.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Challenges Section */}
              <motion.section
                className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-6 flex items-center gap-2">
                  <IoIosStats className="text-blue-500 dark:text-blue-300" /> Challenges Completed
                </h2>
                {userStats.stats?.challenges.length > 0 ? (
                  <ReactApexChart
                    options={chartOptions}
                    series={userStats.stats.challenges.map(challenge => challenge.count)}
                    type="radialBar"
                    height={390}
                  />
                ) : (
                  <p className="text-lg text-gray-700 dark:text-gray-300 text-center py-4">
                    No challenges completed yet.
                  </p>
                )}
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </main>
  );
}