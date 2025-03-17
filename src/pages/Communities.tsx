import { useCallback, useContext, useEffect, useState } from "react";
import { CommunityProps } from "../../utils/types";
import { Link, } from "react-router-dom";
import fetchData from "../../utils/fetchData";
import { SidebarContext } from "@/providers/SidebarContext";
import { useCookies } from "react-cookie";
export default function Communities() {
    const [cookies] = useCookies(["auth_token"])
      const {tab} = useContext(SidebarContext);
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
  return (
    <section className="flex flex-col items-center justify-center w-full max-w-7xl min-h-screen py-8 px-4">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
        Communities
      </h2>

      {communities && communities.communities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {communities.communities.map((community) => (
            <Link
              to={`${community._id}`}
              key={community._id}
              className="group relative bg-slate-300 dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
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
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
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
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">No communities found.</p>
      )}
      {/* <div>
        <p className="text-slate-600 dark:text-slate-400">Showing page {page} of {pages}</p>
        <p className="text-slate-600 dark:text-slate-400">Total students: {studentsCount}</p>
        <p className="text-slate-600 dark:text-slate-400">Total communities: {communitiesCount}</p>
        <p className="text-slate-600 dark:text-slate-400">Total courses: {coursesCount}</p>
      </div> */}
    </section>
  );
}