// import { useState, useEffect, useCallback, Suspense } from "react";
// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import fetchData from "../../utils/fetchData";
// import { useCookies } from "react-cookie";
// import {z} from "zod"
// import { Button } from "@/components/ui/button";
// import { FaSortAlphaDown, FaSortNumericDown } from "react-icons/fa";
// import { FaBookOpen } from "react-icons/fa";
// import { FaUsers } from "react-icons/fa";
// import { FaPeopleGroup } from "react-icons/fa6";
// import {ChartOptions,Community,Role,Sort,User,communityStatsSchema, userSchema} from "../../utils/types"
import {Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Role, User, userSchema } from "../../utils/types";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { SideContextProvider } from "@/providers/SidebarContext";
const Dashboard = () => {
    const [user,setUser] = useState<User|null>(null);
    const [cookies] = useCookies(["auth_token"])
    const navigate = useNavigate()
    useEffect(() => {
      const token = cookies.auth_token;
      if (!token) {
        navigate("/login");
        return;
      };
  
      try {
        const decoded = jwtDecode<{ role: string }>(token);
        const parsedUser = userSchema.safeParse({
          firstName: localStorage.getItem("firstName") || "",
          lastName: localStorage.getItem("lastName") || "",
          email: localStorage.getItem("email") || "",
          role: decoded.role.toString() === Role.ADMIN.toString() ? Role.ADMIN : Role.USER,
          _id: localStorage.getItem("id") || "",
          index: parseInt(localStorage.getItem("index") || "0"),
          isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn") || "false"),
          avatar: localStorage.getItem("avatar") || "",
          bio:user?.bio||"",
          interests: user?.interests||[]
        });
        if (parsedUser.success) {
          setUser(parsedUser.data);
        } else {
          console.error("User data validation failed:", parsedUser.error);
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
      }
    }, [cookies.auth_token]);
  return (
    <SideContextProvider>
    {
      user && (
        <Sidebar user={user}/>
      )
    }
      <Outlet />
    </SideContextProvider>
  )
};

export default Dashboard;
