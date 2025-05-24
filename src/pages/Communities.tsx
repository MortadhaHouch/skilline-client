import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import { CommunityProps, Role } from "../../utils/types";
import { Link } from "react-router-dom";
import fetchData from "../../utils/fetchData";
import { SidebarContext } from "@/providers/SidebarContext";
import { useCookies } from "react-cookie";
import { CiUser } from "react-icons/ci";
import { MdOutlinePostAdd } from "react-icons/md";
import { FaBookOpen, FaPlus } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
export default function Communities() {
    const [cookies] = useCookies(["auth_token"])
    const {tab} = useContext(SidebarContext);
    const [community,setCommunity] = useState<{name:string,description:string}>({
      name:"",
      description:""
    })
    const [communities, setCommunities] = useState<CommunityProps>({
      communities: [],
      page: 1,
      pages: 1,
      studentsCount: 0,
      communitiesCount: 0,
      coursesCount: 0
    });
    const handleFetchData = useCallback(async ()=>{
      try {
        const response = await fetchData("/community", "GET",{},cookies.auth_token,"json","json");
        if (response) {
          setCommunities(response);
        }
      } catch (error) {
        console.error(error);
      }
    },[tab])
    useEffect(()=>{
      handleFetchData()
    },[tab])
    const handleSendRequest = async (id:string)=>{
      try {
        const request = await fetchData("/community/send-request/"+id,"POST",{},cookies.auth_token,"json","json");
        if(request.success){
          alert("Request sent successfully")
        }
      } catch (error) {
        console.log(error);
      }
    }
    const handleCreateCommunity =async (e:FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
      try {
        const request = await fetchData("/community/add","POST",community,cookies.auth_token,"json","json");
        if(request.success){
          setCommunities({
            ...communities,
            communities:[...communities.communities,{
              name:request.community.name,
              description:request.community.description,
              admin:request.community.admin,
              members:request.community.members,
              posts:request.community.posts,
              logo:request.community.logo,
              banner:request.community.banner,
              courses:request.community.courses,
              _id:request.community._id,
            }]
          })
        }
      } catch (error) {
        console.log(error);
      }
    }
  return (
    <section className="w-full max-w-[7xl] flex flex-col items-center justify-center min-h-screen py-8 px-2 gap-8">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
        Skill based Communities
      </h2>
      <div className="flex flex-col gap-4 w-full max-w-7xl justify-center items-center">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
          All communities
        </h3>
      </div>
      {communities && communities.communities.length > 0 ? (
        <div className="gap-6 w-full max-w-7xl flex flex-row flex-wrap justify-center items-center">
          {communities.communities.map((community) => {
            return (
              <Link
                to={`${community._id}`}
                key={community._id}
                onClick={(e)=>{
                  e.stopPropagation()
                  if(!(community.isAdmin ||community.isMember)){
                    e.preventDefault();
                  }
                }}
                className="w-[clamp(300px,33%,350px)] relative bg-slate-300 dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {
                  !(community.isAdmin ||community.isMember) && (
                    <button onClick={()=>handleSendRequest(community._id)} className="absolute top-1 right-1 text-slate-800 dark:text-slate-300 z-10 bg-slate-400 dark:bg-slate-600 p-1 rounded cursor-pointer">send request</button>
                  )
                }
                <div className="h-32 bg-slate-200 dark:bg-slate-700 relative">
                  {community.banner && (
                    <img
                      src={community.banner}
                      alt={`${community.name} Banner`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute top-20 left-4 w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 overflow-hidden">
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
                <div className="p-6 pt-16">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    {community.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {community.description}
                  </p>
                  <div className="w-full flex justify-center items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <button className="flex flex-col justify-center items-center gap-1 rounded-md shadow-md flex-1">
                      <CiUser size={30}/><span className="text-extrabold">{community.members}</span>
                    </button>
                    <button className="flex flex-col justify-center items-center gap-1 rounded-md shadow-md flex-1">
                      <MdOutlinePostAdd size={30}/><span className="text-extrabold">{community.posts}</span>
                    </button>
                    <button className="flex flex-col justify-center items-center gap-1 rounded-md shadow-md flex-1">
                      <FaBookOpen size={30}/><span className="text-extrabold">{community.courses}</span>
                    </button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">No communities found.</p>
      )}
      {
        jwtDecode<{role:string}>(cookies.auth_token).role == Role.ADMIN && (
          <div className="flex flex-col justify-center items-center gap-4 w-[clamp(300px,50%,450px)] border p-2 rounded-md">
            <h2>create a new Community</h2>
            <form onSubmit={handleCreateCommunity} className="p-2 rounded-md w-full flex flex-col justify-center items-center gap-4">
              <div className="w-full flex flex-col justify-start items-center gap-1">
                <label className="w-full text-start" htmlFor="name">name</label>
                <input type="text" name="name" placeholder="name" value={community.name} onChange={(e)=>setCommunity({...community,name:e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600"/>
              </div>
              <div className="w-full flex flex-col justify-start items-center gap-1">
                <label className="w-full text-start" htmlFor="description">description</label>
                <textarea rows={4} name="description" placeholder="description" value={community.description} onChange={(e)=>setCommunity({...community,description:e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600 resize-none"/>
              </div>
              <div className="w-full flex flex-col justify-start items-center gap-1">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg flex flex-row justify-center items-center gap-1" type="submit"><FaPlus size={20}/><span>create</span></button>
              </div>
            </form>
          </div>
        )
      }
    </section>
  );
}