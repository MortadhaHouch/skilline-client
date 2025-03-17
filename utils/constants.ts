const emailRegex = {
    uppercase: /^[A-Z]/,
    domain: /@(gmail|yahoo|outlook)\.com$/,
    fullMatch: /^[A-Z]+[a-z]+[A-Z]+[a-z]+@(gmail|yahoo|outlook)\.com$/,
};
import { IoIosHome } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaRegAddressCard } from "react-icons/fa";
const userLinks = [
    {
        title: "Home",
        path: "",
        icon: IoIosHome,
    },{
        title: "Community",
        path: "communities",
        icon: FaPeopleGroup,
    },{
        title: "Settings",
        path: "settings",
        icon: IoIosSettings,
    },{
        title: "Profile",
        path: "profile",
        icon: FaRegAddressCard
    },{
        title: "Notifications",
        path: "notifications",
        icon: IoIosNotifications,
    }
]
export { emailRegex,userLinks };