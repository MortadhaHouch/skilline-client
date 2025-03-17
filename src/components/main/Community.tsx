import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import fetchData from "../../../utils/fetchData";
import { Community as CommunityType, CourseProps, PostProps } from "../../../utils/types";
import { useParams } from "react-router-dom";
import { MdPostAdd, MdQuiz } from "react-icons/md";
import { FaBookOpen, FaComment, FaEye, FaPlus } from "react-icons/fa";
import NotFoundImage from '../../../public/assets/images/Oops! 404 Error with a broken robot-rafiki.svg';
import { motion } from "framer-motion";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
export default function Community() {
  const [cookies] = useCookies(["auth_token"]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<CommunityType | null>(null);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<PostProps>({
    posts: [],
    page: 1,
    pages: 1,
    total: 0,
  });
  const [courses, setCourses] = useState<CourseProps>({
    courses: [],
    page: 1,
    pages: 1,
  });
  const [activeTab, setActiveTab] = useState<"posts" | "courses">("posts");

  const getCommunity = async () => {
    try {
      setLoading(true);
      const response = await fetchData(`/community/${id}`, "GET", {}, cookies.auth_token, "json", "json");
      setCommunity(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (activeTab === "courses") {
        const response = await fetchData(`/course/by-community/${id}`, "GET", {}, cookies.auth_token, "json", "json");
        setCourses(response);
      } else if (activeTab === "posts") {
        const response = await fetchData(`/post/${id}`, "GET", {}, cookies.auth_token, "json", "json");
        setPosts(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, id, cookies.auth_token]);
  const handleLike = async (id: string) => {
    try {
      const response = await fetchData(`/post/react/${id}`, "POST", {action:"like"}, cookies.auth_token, "json", "json");
      if(response.ok){
        setPosts((prev)=>({
          ...prev,
          posts: prev.posts.map((post) => (post._id === id? {...post, likes: response.likes,dislikes:response.dislikes } : post)),
        }))
      }
    }catch (error) {
      console.error(error);
    }
  }
  const handleDislike = async (id: string) => {
    try {
      const response = await fetchData(`/post/react/${id}`, "POST", {action:"unlike"}, cookies.auth_token, "json", "json");
      if(response.ok){
        setPosts((prev)=>({
          ...prev,
          posts: prev.posts.map((post) => (post._id === id? {...post,likes: response.likes,dislikes:response.dislikes } : post)),
        }))
      }
    }catch (error) {
      console.error(error);
    }
  }
  const handleSendPost = async () => {
    try {
      const response = await fetchData(`/post/${id}`, "POST", { content: postContent }, cookies.auth_token, "json", "json");
      if(response.post){
        setPosts((prevState) => ({
          ...prevState,
          posts: [response.post,...prevState.posts],
        }));
        setPostContent("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCommunity();
  }, [id]);

  useEffect(() => {
    handleFetchData();
  }, [activeTab, handleFetchData]);
  // const handleGenerateQuiz = ()=>{

  // }
  return (
    <main className="flex flex-col items-center justify-start w-screen min-h-screen py-8 bg-slate-100 dark:bg-slate-900">
      {loading ? (
        <div className="flex items-center justify-center w-24 h-24 animate-spin rounded-full border-4 border-white border-t-slate-800 dark:border-t-slate-200" />
      ) : community ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center w-[90%] max-w-7xl"
        >
          <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative">
            {community.banner && (
              <img
                src={community.banner}
                alt={`${community.name} Banner`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="w-full flex flex-col items-center mt-[-4rem]">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 overflow-hidden">
              {community.logo ? (
                <img
                  src={community.logo}
                  alt={`${community.name} Logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {community.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-4">
              {community.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-2 max-w-2xl">
              {community.description}
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400 mt-4">
              <span>
                <strong>{community.members}</strong> Members
              </span>
              <span>
                <strong>{community.posts}</strong> Posts
              </span>
              <span>
                <strong>{community.courses}</strong> Courses
              </span>
            </div>
          </div>
          <div className="w-[90%] max-w-8xl flex flex-col justify-start items-center gap-0 mt-8">
            <div className="w-full flex flex-row justify-center items-center -gap-2 text-sm text-slate-600 dark:text-slate-400">
              <button
                className={`flex flex-row justify-center items-center gap-1 rounded-t-md p-2 bg-slate-300 dark:bg-slate-700 cursor-pointer transition-colors duration-300 ${
                  activeTab === "posts" ? "bg-slate-400 dark:bg-slate-600" : ""
                }`}
                onClick={() => setActiveTab("posts")}
              >
                <MdPostAdd size={20} />
                <span>Posts</span>
              </button>
              <button
                className={`flex flex-row justify-center items-center gap-1 rounded-t-md p-2 bg-slate-300 dark:bg-slate-700 cursor-pointer transition-colors duration-300 ${
                  activeTab === "courses" ? "bg-slate-400 dark:bg-slate-600" : ""
                }`}
                onClick={() => setActiveTab("courses")}
              >
                <FaBookOpen size={20} />
                <span>Courses</span>
              </button>
            </div>
            <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-b-lg p-6">
              {activeTab === "posts" && (
                <div className="flex flex-col justify-start items-center gap-6">
                  <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                      Express Yourself
                    </h3>
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-transparent text-slate-800 dark:text-slate-100"
                      rows={4}
                    />
                    <button
                      disabled={!postContent || postContent.length === 0}
                      onClick={handleSendPost}
                      className="mt-4 rounded-md px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                      Create Post
                    </button>
                  </div>
                  {posts.posts.length > 0 ? (
                    posts.posts.map((post) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-[clamp(300px,50%,450px)] max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="grid grid-cols-[50px_1fr] grid-rows-[25px_25px] items-center gap-2">
                          <div className="row-span-2 col-start-1 row-start-1 rounded-full border-white dark:border-slate-800 bg-white dark:bg-slate-700">
                            {
                              post.author.avatar ? (
                                <motion.img
                                  src={post.author.avatar}
                                  className="w-full h-full rounded-full object-cover"
                                  alt="User Avatar"
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                />
                              ) : (
                                <motion.p
                                  className="w-full h-full rounded-full bg-gray-400 flex justify-center items-center text-xl select-none"
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {post.author.firstName.charAt(0).toUpperCase()}
                                  {post.author.lastName.charAt(0).toUpperCase()}
                                </motion.p>
                              )
                            }
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-4 col-start-2 row-start-1">
                            {post.author.firstName} {post.author.lastName}
                          </h3>
                          <h4 className="text-xs text-slate-600 dark:text-slate-400 col-start-2 row-start-2">{post.author.email}</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          {post.content.length > 100? post.content.substring(0, 100): post.content}
                        </p>
                        <div className="flex  flex-row justify-center items-center gap-4 mt-4 w-full">
                          <button className="text-slate-600 bg-slate-300 dark:bg-slate-700 px-2 py-1 rounded-2xl flex-1 cursor-pointer hover:bg-slate-500 dark:text-slate-400 flex flex-row justify-center items-center gap-1 text-lg">
                            <span>{post.comments}</span> <FaComment />
                          </button>
                          <button onClick={()=>{handleLike(post._id)}} className="text-slate-600 bg-slate-300 dark:bg-slate-700 px-2 py-1 rounded-2xl flex-1 cursor-pointer hover:bg-slate-500 dark:text-slate-400 flex flex-row justify-center items-center gap-1 text-lg">
                            <span>{post.likes}</span> <AiFillLike />
                          </button>
                          <button onClick={()=>{handleDislike(post._id)}} className="text-slate-600 bg-slate-300 dark:bg-slate-700 px-2 py-1 rounded-2xl flex-1 cursor-pointer hover:bg-slate-500 dark:text-slate-400 flex flex-row justify-center items-center gap-1 text-lg">
                            <span>{post.dislikes}</span> <AiFillDislike />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <img
                      src={NotFoundImage}
                      alt="No posts found"
                      className="w-[clamp(320px, 60%, 450px)]"
                    />
                  )}
                </div>
              )}

              {activeTab === "courses" && (
                <div className="flex flex-col justify-start items-center gap-6">
                  {courses.courses.length > 0 ? (
                    courses.courses.map((course) => (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative"
                      >
                        <p className={`absolute top-0 right-0 flex flex-row justify-center items-center gap-1 py-1 px-2 rounded-lg ${course.views > 0 ?'bg-green-300 dark:bg-green-600':'bg-yellow-100 dark:bg-yellow-600'}`}><span className={`${course.views > 0 ?'text-green-500':'text-yellow-500'}`}>{new Intl.NumberFormat('en-US').format(course.views||0)}</span><FaEye color={course.views > 0?'oklch(0.723 0.219 149.579)':'oklch(0.795 0.184 86.047)'}/></p>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          {course.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          {course.description.length > 100 ? course.description.substring(0, 100)+"...":course.description}
                        </p>
                        <div className="grid grid-cols-[50px_1fr] grid-rows-[25px_25px] items-center gap-2">
                          <div className="row-span-2 col-start-1 row-start-1 rounded-full border-white dark:border-slate-800 bg-white dark:bg-slate-700">
                            {
                              course.author.avatar ? (
                                <motion.img
                                  src={course.author.avatar}
                                  className="w-full h-full rounded-full object-cover"
                                  alt="User Avatar"
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                />
                              ) : (
                                <motion.p
                                  className="w-full h-full rounded-full bg-gray-400 flex justify-center items-center text-xl select-none"
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {course.author.firstName.charAt(0).toUpperCase()}
                                  {course.author.lastName.charAt(0).toUpperCase()}
                                </motion.p>
                              )
                            }
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-4 col-start-2 row-start-1">
                            {course.author.firstName} {course.author.lastName}
                          </h3>
                          <h4 className="text-xs text-slate-600 dark:text-slate-400 col-start-2 row-start-2">{course.author.email}</h4>
                        </div>
                        <p className="w-full flex flex-row justify-start items-center gap-1">
                          <MdQuiz /><span>{course.quizzes.length||0} {course.quizzes.length == 1?'quiz':'quizzes'} created</span>
                        </p>
                        <button onClick={()=>{}} className="flex flex-row justify-center items-center gap-1 bg-primary text-white text-md py-1 px-2 rounded-lg">
                        <FaPlus /><span>generate yours</span>
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <img
                      src={NotFoundImage}
                      alt="No courses found"
                      className="w-[clamp(320px, 60%, 450px)]"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.section>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">No community found.</p>
      )}
    </main>
  );
}