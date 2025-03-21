import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { motion } from "framer-motion";
import { FaUser, FaComments, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { RiLoader4Line } from "react-icons/ri";
import { useCookies } from "react-cookie";
import fetchData from "../../utils/fetchData";
import { jwtDecode } from "jwt-decode";
import { Role } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { FaPeopleGroup } from "react-icons/fa6";

const chartOptions = {
  chart: {
    height: 380,
    type: "line",
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    curve: "smooth",
  },
  title: {
    text: "Community Activity Overview",
    align: "center",
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    title: {
      text: "Count",
    },
  },
  grid: {
    borderColor: "#f1f1f1",
  },
  colors: ["#00E396"],
};

const UserDashboard = () => {
  const [userStats, setUserStats] = useState({
    communities: [],
    likedPosts: 0,
    dislikedPosts: 0,
    totalComments: 0,
    quizzes: 0,
  });
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["auth_token"]);
  const navigate = useNavigate();
  useEffect(() => {
    if (jwtDecode<{ role: string }>(cookies.auth_token).role === Role.ADMIN.toString()) {
      navigate("/dashboard");
    }
  }, [cookies.auth_token, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await fetchData(
          "/community/",
          "GET",
          {},
          cookies.auth_token,
          "json",
          "json"
        );
        
        // Calculate monthly community join dates
        const communityMonths = data.communities.reduce((acc: any, community: any) => {
          const date = new Date(community.createdAt);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        }, {});

        const categories = Object.keys(communityMonths);
        const seriesData = Object.values(communityMonths);

        setUserStats({
          communities: data.communities,
          likedPosts: data.likedPosts,
          dislikedPosts: data.dislikedPosts,
          totalComments: data.totalComments,
          quizzes: data.quizzes,
        });

        chartOptions.xaxis.categories = categories;
        setChartSeries([{ name: "Communities Joined", data: seriesData }]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [cookies.auth_token]);

  const [chartSeries, setChartSeries] = useState([
    {
      name: "Communities Joined",
      data: [],
    },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.main
      className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Communities Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-4">
            <FaPeopleGroup className="text-4xl text-green-500 dark:text-green-300" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Communities</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userStats.communities.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Likes Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-4">
            <FaThumbsUp className="text-4xl text-red-500 dark:text-red-300" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Likes</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userStats.likedPosts}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dislikes Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-4">
            <FaThumbsDown className="text-4xl text-blue-500 dark:text-blue-300" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Dislikes</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userStats.dislikedPosts}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Comments Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-4">
            <FaComments className="text-4xl text-purple-500 dark:text-purple-300" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Comments</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userStats.totalComments}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quizzes Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-4">
            <FaUser className="text-4xl text-orange-500 dark:text-orange-300" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Quizzes</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userStats.quizzes}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.section
        className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <IoIosStats className="text-blue-500 dark:text-blue-300" />
          Community Activity Overview
        </h2>
        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center">
              <RiLoader4Line className="animate-spin text-4xl text-blue-500 dark:text-blue-300" />
            </div>
          ) : (
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={350}
            />
          )}
        </div>
      </motion.section>

      {/* Communities List */}
      <motion.section
        className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <FaPeopleGroup className="text-green-500 dark:text-green-300" />
          My Communities
        </h2>
        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center">
              <RiLoader4Line className="animate-spin text-4xl text-blue-500 dark:text-blue-300" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-left">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats.communities.map((community: any) => (
                    <tr
                      key={community._id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="py-2 px-4">{community.name}</td>
                      <td className="py-2 px-4">{community.description}</td>
                      <td className="py-2 px-4">{community.totalMembers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.section>
    </motion.main>
  );
};

export default UserDashboard;