import { useState, useEffect, useCallback, Suspense } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import fetchData from "../../utils/fetchData";
import { useCookies } from "react-cookie";
import {z} from "zod"
import { Button } from "@/components/ui/button";
import { FaSortAlphaDown, FaSortNumericDown } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import {ChartOptions,CommunityStats,Role,Sort,User,communityStatsSchema, userSchema} from "../../utils/types"
import {jwtDecode} from "jwt-decode";
import {motion} from "framer-motion"
export default function MainAdminDashboard() {
    const [usersPerMonthStats, setUsersPerMonthStats] = useState<Partial<ChartOptions> | null>(null);
    const [communitiesPerMonthStats, setCommunitiesPerMonthStats] = useState<Partial<ChartOptions> | null>(null);
    const [cookies] = useCookies(["auth_token"])
    const [communities,setCommunities] = useState<CommunityStats|null>(null);
    const [sort, setSort] = useState<Sort>(Sort.NAME);
    const [isSorted, setIsSorted] = useState(false);
    const [user,setUser] = useState<User|null>(null);
    const DashboardSchema = z.object({
      usersPerMonth:z.array(z.object({
        count:z.number(),
          _id:z.object({
            month:z.number(),
            year:z.number(),
            day:z.number(),
          })
        })  
      ),
      communitiesPerMonth:z.array(z.object({
        count:z.number(),
          _id:z.object({
            month:z.number(),
            year:z.number(),
            day:z.number(),
          })
        })  
      )
    })
    const handleSort = useCallback((sort: Sort) => {
      setSort(sort);
      
      setCommunities((prev) => {
        if (!prev) return prev;
    
        const sortedCommunities = [...prev.communities].sort((a, b) => {
          switch (sort) {
            case Sort.NAME:
              return a.name.localeCompare(b.name);
            case Sort.DESCRIPTION:
              return a.description.localeCompare(b.description);
            case Sort.MEMBERS:
              return a.totalMembers - b.totalMembers;
            default:
              return 0;
          }
        });
    
        // Reverse the order if not sorted (for descending order)
        if (!isSorted) sortedCommunities.reverse();
    
        return {
          ...prev,
          communities: sortedCommunities,
        };
      });
    }, [isSorted]);
    
    useEffect(() => {
      setIsSorted((v) => !v);
      return () => {
        setIsSorted(false);
      };
    }, [isSorted, sort, handleSort]);
    
    const handleFetchData = async () => {
      try {
        const [userStats,communityStats] = await Promise.all(
          [
            fetchData("/user/users","GET",{},cookies.auth_token,"json","json"),
            fetchData("/community/","GET",{},cookies.auth_token,"json","json")
          ]
        );
        const communitiesParser = communityStatsSchema.safeParse({
          stats: communityStats.communitiesPerMonth,
          pagination: {
            page: communityStats.page,
            pages: communityStats.pages,
          },
          communities: communityStats.communities,
          studentsCount: communityStats.studentsCount,
          communitiesCount: communityStats.communitiesCount,
          coursesCount: communityStats.coursesCount,
        })
  
        if(communitiesParser.success){
          console.log(communitiesParser.data);
          setCommunities(communitiesParser.data);
        }else{
          console.log(communitiesParser.error);
        }
        const statsParsed = DashboardSchema.safeParse({
          usersPerMonth:userStats.usersPerMonth,
          communitiesPerMonth:communityStats.communitiesPerMonth
        });
        if(statsParsed.success){
          console.log(statsParsed.data);
          setUsersPerMonthStats({
            series: [{
              name: "Users",
              data: statsParsed.data.usersPerMonth.map((item) => item.count),
            }],
            labels: statsParsed.data.usersPerMonth.map((item) => `${item._id.day}/${item._id.month}/${item._id.year}`),
            title: {
              text: "User account per month",
            },
            subtitle: {
              text: "Progress of Users access to platform per month",
            },
            legend: {
              position: "top",
            },
            chart: {
              type: "polarArea",
            },
            xaxis: {
              categories: statsParsed.data.usersPerMonth.map((item) => `${item._id.day}/${item._id.month}/${item._id.year}`),
            },
            yaxis: {
              title: {
                text: "Number of users",
              },
            },
          });
          setCommunitiesPerMonthStats({
            series: [{
              name: "Communities",
              data: statsParsed.data.communitiesPerMonth.map((item) => item.count),
            }],
            labels: statsParsed.data.communitiesPerMonth.map((item) => `${item._id.day}/${item._id.month}/${item._id.year}`),
            title: {
              text: "Communities per month",
            },
            subtitle: {
              text: "Communities per month",
            },
            legend: {
              position: "top",
            },
            chart: {
              type: 'polarArea',
            },
            xaxis: {
              categories: statsParsed.data.communitiesPerMonth.map((item) => `${item._id.day}/${item._id.month}/${item._id.year}`),
            },
            yaxis: {
              title: {
                text: "Number of communities",
              },
            },
          });
        }else{
          console.log("Error parsing dashboard stats:", statsParsed.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(() => {
      handleFetchData();
      setUser({
        firstName: localStorage.getItem("firstName")||"",
        lastName: localStorage.getItem("lastName")||"",
        email: localStorage.getItem("email")||"",
        role: jwtDecode<{ role: string}>(cookies.auth_token).role.toString() === Role.ADMIN.toString() ? Role.ADMIN :Role.USER,
        _id: localStorage.getItem("id")||"",
        index: parseInt(localStorage.getItem("index")||""),
        isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")||"false"),
        avatar: localStorage.getItem("avatar")||"",
      });
      const parsedUser = userSchema.safeParse(user);
      if(parsedUser.success){
        console.log(parsedUser.data);
      }else{
        console.log(parsedUser.error);
      }
    }, []);
    return (
      <main className="p-6 rounded-lg shadow-md flex flex-col justify-start items-center mb-8 gap-4">
        <h2 className="w-full max-w-7xl text-2xl md:text-3xl lg:text-5xl font-bold mb-6">Dashboard</h2>
        <section className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          {[
            { title: "Students", value: communities?.studentsCount, color: "bg-blue-200 dark:bg-blue-950 text-blue-950 dark:text-blue-200", icon: FaUsers },
            { title: "Communities", value: communities?.communitiesCount, color: "bg-green-200 dark:bg-green-950 text-green-950 dark:text-green-200", icon: FaPeopleGroup },
            { title: "Courses", value: communities?.coursesCount, color: "bg-purple-200 dark:bg-purple-950 text-purple-950 dark:text-purple-200", icon: FaBookOpen },
          ].map((item,index)=>{
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`relative grid grid-cols-2 grid-rows-2 gap-2 p-4 pb-0 bg-gradient-to-br ${item.color} rounded-2xl shadow-lg shadow-gray-900/30 backdrop-blur-md border border-white/20 transform transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-gray-800/40`}
              >
                <h2 className="col-span-1 row-span-1 text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-xl group-hover:text-gray-200 transition-colors duration-300">
                  {item.value}
                </h2>
                <item.icon className="col-span-1 row-span-1 place-self-end w-16 h-16 mb-2 group-hover:scale-110 transition-transform duration-300 ease-out drop-shadow-lg" />
                <h3 className="col-span-2 row-span-1 p-0 m-0 text-2xl md:text-3xl font-semibold drop-shadow-md group-hover:text-gray-100 transition-colors duration-300">
                  {item.title}
                </h3>
              </motion.div>
            )
          })}
        </section>
        <section className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {usersPerMonthStats?.series && (
              <Suspense 
                fallback={
                  <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 flex justify-center items-center animate-pulse">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-500 dark:text-gray-300">Loading chart...</p>
                    </div>
                  </div>
                }
              >
                <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Students access Over Time
                  </h3>
                    <Chart
                      options={usersPerMonthStats as ApexOptions}
                      series={usersPerMonthStats.series}
                      type="area"
                      height={350}
                    />
                </div>
              </Suspense>
            )}
  
            {communitiesPerMonthStats?.series && (
              <Suspense
                fallback={
                  <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 flex justify-center items-center animate-pulse">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-500 dark:text-gray-300">Loading chart...</p>
                    </div>
                  </div>
                }
              >
                <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Community Growth Over Time
                  </h3>
                  <Chart
                    options={communitiesPerMonthStats as ApexOptions}
                    series={communitiesPerMonthStats.series}
                    type="area"
                    height={350}
                  />
                </div>
              </Suspense>
            )}
        </section>
  
        <section className="w-full max-w-7xl p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border"><span>Name</span><button onClick={()=>handleSort(Sort.NAME)}><FaSortAlphaDown/></button></th>
                <th className="py-2 px-4 border"><span>description</span><button onClick={()=>handleSort(Sort.DESCRIPTION)}><FaSortAlphaDown/></button></th>
                <th className="py-2 px-4 border"><span>members</span><button onClick={()=>handleSort(Sort.MEMBERS)}><FaSortNumericDown/></button></th>
              </tr>
            </thead>
            <tbody>
              {
                communities?.communities.map((community) => (
                  <tr key={community._id}>
                    <td className="py-2 px-4 border">{community.name}</td>
                    <td className="py-2 px-4 border">{community.description}</td>
                    <td className="py-2 px-4 border">{community.totalMembers}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
              {
                communities && Array.from({length:communities?.pagination.pages}).map((_,idx)=>{
                  return(
                    <Button key={idx} className="cursor-pointer">
                      {idx+1}
                    </Button>
                  )
                })
              }
            </div>
        </section>
      </main>
    );
}