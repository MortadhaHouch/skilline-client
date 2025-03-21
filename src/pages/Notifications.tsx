import fetchData from "../../utils/fetchData";
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { Notification } from "../../utils/types"; // Import the types
import {motion} from "framer-motion"
export default function Notifications() {
    const [cookies] = useCookies(["auth_token"]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(1);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        handleFetchData(page);
    }, [page]);

    async function handleFetchData(page: number) {
        try {
            setIsLoading(true);
            const request = await fetchData(`/notification/${page}`, "GET", cookies.auth_token, "", "json", "json");
            if (request.notifications) {
                setNotifications(request.notifications);
                setCount(request.count);
                setPage(request.page);
                setPages(request.pages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex flex-col items-center justify-start w-screen min-h-screen bg-gray-100 dark:bg-gray-800 py-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-700 mb-8">Notifications</h1>
            <section className="flex flex-col items-center justify-center w-[80%] max-w-7xl bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">Total Notifications: {count}</p>
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`w-full p-4 mb-4 rounded-lg shadow-sm ${
                                notification.isRead ? 'text-extrabold' : 'bg-light border-l-4 border-blue-500'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{notification.title}</h2>
                                {!notification.isRead && (
                                    <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                                        New
                                    </span>
                                )}
                            </div>
                            <p className="bg-slate-50 dark:bg-slate-500 text-gray-600 dark:text-gray-100 mt-2">{notification.content}</p>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-2">
                                    {notification.from.avatar ? (
                                        <motion.img
                                            src={notification.from.avatar}
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
                                            {notification.from.firstName.charAt(0).toUpperCase()}
                                            {notification.from.lastName.charAt(0).toUpperCase()}
                                        </motion.p>
                                    )}
                                    <p className="text-sm text-gray-700">
                                        {notification.from.firstName} {notification.from.lastName}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </p>
                            </div>
                            {notification.isRead && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Read at: {new Date(notification.readAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 dark:text-gray-100">No notifications found.</p>
                )}
                <div className="flex justify-center items-center mt-6">
                    {Array.from({ length: pages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setPage(index + 1)}
                            className={`mx-1 px-4 py-2 rounded-lg ${
                                page === index + 1
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}