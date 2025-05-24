import { Suspense, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import fetchData from "../../../utils/fetchData";
import { CommentType, Community as CommunityType, CourseProps, Leaderboard, PostProps, Quiz, QuizProps, Request, Role, User } from "../../../utils/types";
import { useNavigate, useParams } from "react-router-dom";
import { MdCheckCircle, MdLeaderboard, MdPostAdd, MdQuiz } from "react-icons/md";
import { FaBookOpen, FaComment, FaEye, FaPlus, FaUsers } from "react-icons/fa";
import NotFoundImage from '../../../public/assets/images/Oops! 404 Error with a broken robot-rafiki.svg';
import { motion } from "framer-motion";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { fileType } from "../../../utils/constants";
import { jwtDecode } from "jwt-decode";
import Popover from "./Popover";
import { FaXmark } from "react-icons/fa6";
import SlideSheetQuizzes from "./Quizzes";
import { RiUserFollowLine } from "react-icons/ri";
import { IoMdExit } from "react-icons/io";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";
import Comments from "./Comments";
export default function Community() {
  const [cookies] = useCookies(["auth_token"]);
  const { id } = useParams() as {id:string};
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<CommunityType | null>(null);
  const [postContent, setPostContent] = useState("");
  const [comments,setComments] = useState<CommentType[]>([])
  const navigate = useNavigate()
  const [course,setCourse] = useState<{title:string,description:string,files:File[]}>({title:"",description:"",files:[]});
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
  const [,setQuiz] = useState<Quiz & {_id:string}|null>(null);
  const [open,setOpen] = useState(false);
  const [quizzes,setQuizzes] = useState<QuizProps|null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "courses" | "requests" | "members" | "leaderboard">("posts");
  const [isShown, setIsShown] = useState(false);
  const [requests,setRequests] = useState<Request[]>([]);
  const [members,setMembers] = useState<User[]>([]);
  const [leaderboard,setLeaderboard] = useState<Leaderboard[]>([]);
  const getCommunity = async () => {
    try {
      setLoading(true);
      const response = await fetchData(`/community/${id}`, "GET", {}, cookies.auth_token, "json", "json");
      if(response.ok){
        setCommunity(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleGenerateQuiz = async (courseId:string)=>{
    try {
      const response = await fetchData(`/quiz/${id}/${courseId}`,"POST",{},cookies.auth_token,"json","json");
      if(response.quiz){
        setQuiz(response.quiz);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getQuizzes = async (courseId:string)=>{
    try {
      const response = await fetchData(`/quiz/${id}/${courseId}`,"GET",{},cookies.auth_token,"json","json");
      if(response.quizzes){
        // setIsShown(true);
        setQuizzes({...response,_id:courseId});
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleFetchData = useCallback(async () => {
    try {
      setLoading(true);
      const isAdmin = jwtDecode<{role:string}>(cookies.auth_token).role === Role.ADMIN.toString();
      if (activeTab === "courses") {
        const response = await fetchData(`/course/by-community/${id}`, "GET", {}, cookies.auth_token, "json", "json");
        setCourses(response);
      } else if (activeTab === "posts") {
        const response = await fetchData(`/post/${id}`, "GET", {}, cookies.auth_token, "json", "json");
        setPosts(response);
      }else if(isAdmin && activeTab === "requests"){
        const response = await fetchData(`/community/requests/${id}`,"GET",{},cookies.auth_token,"json","json");
        if(response.requests){
          setRequests(response.requests);
        }
      }else if(activeTab === "members"){
        const response = await fetchData(`/community/members/${id}`,"GET",{},cookies.auth_token,"json","json");
        if(response.members){
          setMembers(response.members);
          console.log(response.members);
        }
      }else if (activeTab === "leaderboard"){
        const response = await fetchData(`/community/leaderboard/${id}`,"GET",{},cookies.auth_token,"json","json");
        if(response){
          setLeaderboard(response.leaderboard);
          console.log(response);
        }
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
  const handleDeleteCourse = async(id:string)=>{
    const isConfirmed = confirm("Are you sure you want to delete this course?");
    if(isConfirmed){try {
      const request = await fetchData(`/course/delete/${id}`,"DELETE",{},cookies.auth_token,"json","json");
      if(request.success){
        setCourses((prev)=>({...prev,courses:prev.courses.filter((course)=>course._id!==id)}));
      }else{
        alert("Failed to delete course");
      }
      } catch (error) {
        console.log(error);
      }
    }else{
      console.log("Course deletion cancelled");
    }
  }
  const RenderDocument = (filename: string, courseId: string, resource: string) => {
    if (!filename) return null;
    const formattedFilename = filename.split(".").pop()?.toLowerCase();
    if (formattedFilename && fileType.image.includes(formattedFilename)) {
      return <img loading="lazy" width={"100%"} height={"100%"} crossOrigin="use-credentials" className="w-[clamp(200px,50vw,600px)] object-cover" src={`${import.meta.env.VITE_PUBLIC_REQUEST_URL}/course/file/${id}/${courseId}/${resource}`} alt="" />;
    } else if (formattedFilename && fileType.video.includes(formattedFilename)) {
      return <video width={"100%"} height={"100%"} crossOrigin="use-credentials" className="object-cover" controls src={`${import.meta.env.VITE_PUBLIC_REQUEST_URL}/course/file/${id}/${courseId}/${resource}`}></video>;
    } else if (formattedFilename && fileType.pdf.includes(formattedFilename)) {
      return <iframe width={"100%"} height={"100%"} loading="lazy" frameBorder={2} className="w-[clamp(200px,60vw,600px)] h-[clamp(400px,60vw,600px)]" src={`${import.meta.env.VITE_PUBLIC_REQUEST_URL}/course/file/${id}/${courseId}/${resource}`}></iframe>;
    }
    return <span>Unsupported file type</span>;
  };
  const handleDeleteCommunity =async ()=>{
    const isConfirmed = confirm("Are you sure you want to delete this community?");
    if(isConfirmed){
      try {
        const request = await fetchData(`/community/${id}`,"DELETE",{},cookies.auth_token,"json","json");
        if(request.success){
          navigate(-1);
        }else{
          alert("Failed to delete community");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  const handleDeclineRequest = async (reqId:string)=>{
    try {
      const response = await fetchData(`/community/accept-request/${id}/${reqId}`,"POST",{accept:false},cookies.auth_token,"json","json");
      if(response.ok){
        handleFetchData();
      }else{
        alert("Failed to decline request");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleAcceptRequest = async (reqId:string)=>{
    try {
      const response = await fetchData(`/community/accept-request/${id}/${reqId}`,"POST",{accept:true},cookies.auth_token,"json","json");
      if(response.ok){
        handleFetchData();
      }else{
        alert("Error");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <main className="flex flex-col items-center justify-start w-screen min-h-screen py-8 bg-slate-100 dark:bg-slate-900">
      {loading ? (
        <section className="flex items-center justify-center w-24 h-24 animate-spin rounded-full border-4 border-white border-t-slate-800 dark:border-t-slate-200" />
      ) : community ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center w-[90%] max-w-7xl"
        >
          <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative">
            {
              community.admin._id === jwtDecode<{_id:string}>(cookies.auth_token)._id && (
                <button className="absolute top-2 right-2 text-red-800 bg-red-400 dark:text-red-100 dark:bg-red-500 rounded-lg p-2 transition-all duration-300 hover:text-red-600 dark:hover:text-red-400 flex flex-row justify-center items-center gap-1 cursor-pointer" onClick={handleDeleteCommunity}>
                  <FaXmark/><span>delete community</span>
                </button>
              )
            }
            {community.banner && (
              <img
                src={community.banner}
                alt={`${community.name} Banner`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="w-full flex flex-col items-center mt-[-4rem]">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-slate-300 dark:bg-slate-700 overflow-hidden z-10 hover:scale-110 transition-all duration-300">
              {community.logo ? (
                <img
                  src={community.logo}
                  alt={`${community.name} Logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-800 bg-slate-300 dark:bg-slate-900 dark:text-slate-100">
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
                  activeTab === "leaderboard" ? "bg-slate-400 dark:bg-slate-600" : ""
                }`}
                onClick={() => setActiveTab("leaderboard")}
              >
                <MdLeaderboard size={20} />
                <span>Leaderboard</span>
              </button>
              <button
                className={`flex flex-row justify-center items-center gap-1 rounded-t-md p-2 bg-slate-300 dark:bg-slate-700 cursor-pointer transition-colors duration-300 ${
                  activeTab === "members" ? "bg-slate-400 dark:bg-slate-600" : ""
                }`}
                onClick={() => setActiveTab("members")}
              >
                <FaUsers size={20} />
                <span>Members</span>
              </button>
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
              {
                community.admin._id === jwtDecode<{_id:string}>(cookies.auth_token)._id && (
                  <button
                    className={`flex flex-row justify-center items-center gap-1 rounded-t-md p-2 bg-slate-300 dark:bg-slate-700 cursor-pointer transition-colors duration-300 ${
                      activeTab === "requests" ? "bg-slate-400 dark:bg-slate-600" : ""
                    }`}
                    onClick={() => {
                      setActiveTab("requests");
                      handleFetchData();
                    }}
                  >
                    <RiUserFollowLine size={20} />
                    <span>Requests</span>
                  </button>
                )
              }
            </div>
            <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-b-lg p-6">
              {
                activeTab === "members" && (
                  <div className="flex flex-col justify-start items-center gap-6">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                      Members
                    </h3>
                    <div className="flex flex-col justify-start items-center gap-2">
                    {members.map((member) => (
                        <motion.div
                          key={member._id}
                          className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 relative overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                          whileHover={{ scale: 1.03 }}
                        >
                          {
                            community.admin._id === jwtDecode<{_id:string}>(cookies.auth_token)._id && (
                              <button
                                className="absolute top-2 right-2 p-1 rounded-full bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 transition duration-300"
                                title="Remove User"
                              >
                                <IoMdExit size={20} className="text-red-500" />
                              </button>
                            )
                          }
                          <div className="flex flex-row justify-start items-center gap-6">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.firstName}
                                className="w-16 h-16 rounded-full border-2 border-slate-300 dark:border-slate-600"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-700 flex justify-center items-center">
                                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                  {member.firstName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="flex flex-col gap-1">
                              <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                {member.firstName} {member.lastName}
                              </h4>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {member.email}
                              </span>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {member.bio}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Interests: {member.interests.join(", ")}
                              </p>
                              <div className="flex flex-row items-center gap-2 mt-2">
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    member.role === "ADMIN"
                                      ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200"
                                      : "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200"
                                  }`}
                                >
                                  {member.role}
                                </span>
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    member.index === 0
                                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-200"
                                      : member.index === 1
                                      ? "bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-200"
                                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
                                  }`}
                                >
                                  Access Level: {member.index === 0 ? "Owner" : member.index === 1 ? "Admin" : "User"}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Access: {member.index === 0 ? "Full control over platform" : member.index === 1 ? "Admin privileges" : "Regular user"}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                </div>
                )
              }
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
                      className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-transparent text-slate-800 dark:text-slate-100 resize-none"
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
                          <Comments post={post} setComments={setComments} comments={comments}/>
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
                      className="w-[clamp(320px, 40%, 450px)]"
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
                        className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative flex flex-col justify-center items-center gap-2"
                      >
                        <p className={`absolute top-0 right-0 flex flex-row justify-center items-center gap-1 py-1 px-2 rounded-lg ${course.views > 0 ?'bg-green-300 dark:bg-green-600':'bg-yellow-100 dark:bg-yellow-600'}`}><span className={`${course.views > 0 ?'text-green-500':'text-yellow-500'}`}>{new Intl.NumberFormat('en-US').format(course.views||0)}</span><FaEye color={course.views > 0?'oklch(0.723 0.219 149.579)':'oklch(0.795 0.184 86.047)'}/></p>
                        <h3 className="w-full text-lg font-semibold text-slate-800 dark:text-slate-100">
                          {course.title}
                        </h3>
                        <p className="w-full text-sm text-slate-600 dark:text-slate-400 mt-2">
                          {course.description.length > 100 ? course.description.substring(0, 100)+"...":course.description}
                        </p>
                        <div>
                          {
                            course.resource.map((res,idx)=>{
                              return (
                                <Suspense key={idx} fallback={<div className="text-slate-600 dark:text-slate-400 flex flex-row justify-center items-center gap-1 text-sm">Loading...</div>}>
                                  <div className="text-slate-600 dark:text-slate-400 flex flex-row justify-center items-center gap-1 text-sm">
                                    {RenderDocument(res,course._id,res)}
                                  </div>
                                </Suspense>
                              )
                            })
                          }
                        </div>
                        <div className="w-full grid grid-cols-[50px_1fr] grid-rows-[25px_25px] items-center gap-2">
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
                        <button onClick={()=>{getQuizzes(course._id)}} className="w-full flex flex-row justify-start items-center gap-1">
                          <MdQuiz /><span>{course.quizzes} {course.quizzes == 1?'quiz':'quizzes'} created</span>
                        </button>
                        {
                          quizzes && (
                            <SlideSheetQuizzes open={open} setOpen={setOpen} count={quizzes.quizzes.length} course={{title:course.title,description:course.description,_id:course._id}} page={quizzes.page} pages={quizzes.pages} quizzes={quizzes.quizzes} />
                          )
                        }
                        <button onClick={()=>{handleGenerateQuiz(course._id)}} className="flex flex-row justify-center items-center gap-1 text-slate-600 bg-slate-300 dark:bg-slate-700 dark:text-slate-300 text-md py-1 px-2 rounded-lg cursor-pointer hover:bg-slate-500 dark:hover:bg-slate-600">
                        <FaPlus /><span>generate yours</span>
                        </button>
                        {
                          community.admin._id === jwtDecode<{_id:string}>(cookies.auth_token)._id && (
                            <button onClick={()=>handleDeleteCourse(course._id)} className="absolute bottom-0 right-0 flex flex-row justify-center items-center gap-1 text-red-600 bg-red-300 dark:bg-red-700 dark:text-red-300 text-md py-1 px-2 rounded-lg cursor-pointer hover:bg-red-500 dark:hover:bg-red-600">
                                <FaXmark/> delete course
                            </button>
                          )
                        }
                      </motion.div>
                    ))
                  ) : (
                    <img
                      src={NotFoundImage}
                      alt="No courses found"
                      className="w-[clamp(320px, 40%, 450px)]"
                    />
                  )}
                  {
                    community.admin._id === jwtDecode<{_id:string}>(cookies.auth_token)._id && (
                      <button onClick={()=>setIsShown(true)} className="flex flex-row justify-center items-center gap-1 text-slate-600 bg-slate-300 dark:bg-slate-700 dark:text-slate-300 text-md py-1 px-2 rounded-lg cursor-pointer hover:bg-slate-500 dark:hover:bg-slate-600">
                        <FaPlus /><span>Create Course</span>
                      </button>
                    )
                  }
                </div>
              )}
              {
                activeTab === "requests" && community.admin._id === jwtDecode<{_id:string}>(cookies.auth_token)._id && (
                  <div className="w-full flex flex-col justify-center items-center gap-2">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">Requests</h3>
                    {
                      requests.length > 0 ? (
                        <div className="w-full flex flex-col justify-center items-center gap-2">
                          {
                            requests.map((req,index)=>(
                              <motion.div
                                key={index}
                                className="w-full flex flex-col justify-center items-center gap-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                              >
                                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4">{req.from.firstName} {req.from.lastName}</h4>
                                <p className="text-slate-600 dark:text-slate-400">{req.status}</p>
                                <div className="w-full flex flex-row justify-end items-center gap-2">
                                  <button onClick={()=>handleDeclineRequest(req.from._id)} className="flex flex-row justify-center items-center gap-1 text-slate-600 bg-slate-300 dark:bg-slate-700 dark:text-slate-300 text-md py-1 px-2 rounded-lg cursor-pointer hover:bg-slate-500 dark:hover:bg-slate-600">
                                    <FaXmark color="red" /> decline
                                  </button>
                                  <button onClick={()=>handleAcceptRequest(req.from._id)} className="flex flex-row justify-center items-center gap-1 text-slate-600 bg-slate-300 dark:bg-slate-700 dark:text-slate-300 text-md py-1 px-2 rounded-lg cursor-pointer hover:bg-slate-500 dark:hover:bg-slate-600">
                                    <MdCheckCircle color="green" /> accept
                                  </button>
                                </div>
                              </motion.div>
                            ))
                          }
                        </div>
                      ):(
                        <p className="text-slate-600 dark:text-slate-400">No requests found.</p>
                      )
                    }
                  </div>
                )
              }
              {
                activeTab === "leaderboard" && (
                  <div className="w-full flex flex-col justify-center items-center gap-2">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">Leaderboard</h3>
                    {
                      leaderboard.length > 0 ? (
                        <div className="w-full flex flex-col justify-center items-center gap-2">
                          <Table>
                            <TableRow>
                              <TableHead>
                                avatar
                              </TableHead>
                              <TableHead>
                                name
                              </TableHead>
                              <TableHead>
                                score
                              </TableHead>
                              <TableHead>
                                count
                              </TableHead>
                              <TableHead>
                                accuracy
                              </TableHead>
                            </TableRow>
                            <TableBody>
                          {
                            leaderboard.map((leader)=>(
                              <TableRow key={leader._id} className={leader.isMe ? "bg-slate-200 dark:bg-slate-800" : ""}>
                                <TableCell>
                                  {
                                    leader.avatar ?(
                                      <motion.img
                                        src={leader.avatar}
                                        className="w-12 h-12 rounded-full border-4 border-slate-500 hover:border-slate-600 transition-all duration-300"
                                        alt="User Avatar"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      />
                                    ):(
                                      <p className="w-12 h-12 rounded-full border-4 border-slate-600 hover:border-slate-600 transition-all duration-300 flex flex-row justify-center items-center text-slate-800 dark:text-slate-100">
                                        {leader.firstName.charAt(0).toUpperCase()}
                                      </p>
                                    )
                                  }
                                </TableCell>
                                <TableCell className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4">{leader.firstName} {leader.firstName}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-400">{leader.score.toFixed(2)}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-400">{leader.count}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-400">{leader.accuracy.toFixed(2)}%</TableCell>
                                </TableRow>
                              ))
                            }
                            </TableBody>
                          </Table>
                        </div>
                      ):(
                        <p className="text-slate-600 dark:text-slate-400">No leaderboard found.</p>
                      )
                    }
                  </div>
                )
              }
            </div>
          </div>
          {
            jwtDecode<{role:Role}>(cookies.auth_token).role === Role.ADMIN.toString() && isShown && (
              <Popover isShown={isShown} setIsShown={setIsShown} course={course} id={id} setCourse={setCourse} setCourses={setCourses}/>
            )
          }
        </motion.section>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">No community found.</p>
      )}
    </main>
  );
}