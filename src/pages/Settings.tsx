import { FormEvent, useState } from "react"
import SettingsImage from "../../public/assets/images/Update.svg"
import fetchData from "../../utils/fetchData"
import { useCookies } from "react-cookie";
import {motion} from "framer-motion"
export default function Settings() {
    const [settings, setSettings] = useState<{
        firstName?: string,
        lastName?: string,
        password?: string,
        bio?: string
    }>({
        firstName: '',
        lastName: '',
        password: '',
        bio: '',        
    })
    const [error, setError] = useState<string>('')
    const [cookies] = useCookies(["auth_token"]);
    const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const request = await fetchData("/user/update","POST",settings,cookies.auth_token,"json","json");
            console.log(request);
        } catch (error) {
            console.log(error);
            setError("Failed to update settings")
        }
    }
    return (
        <main className="flex flex-row items-center justify-center flex-wrap w-screen gap-2 min-h-screen">
            <motion.img 
                src={SettingsImage} 
                alt="Settings" 
                className="w-[clamp(320px,60%,450px)]"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { x: -100, scale: 0.75,opacity: 0.5 },
                    visible: { x: 0, scale: 1, opacity: 1, transition: { duration: 0.5 } }
                }}
            />
            <motion.section 
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { x: 100, scale: 0.75,opacity: 0.5 },
                    visible: { x: 0, scale: 1,opacity: 1, transition: { duration: 0.5 } }
                }}
                className="flex flex-col items-center justify-center w-[clamp(320px,60%,450px)]">
                <h1 className="text-2xl md:text-4xl font-semibold text-blue-700">Settings Page</h1>
                <form onSubmit={handleSubmit} action="" className="w-full flex flex-col justify-center items-center gap-4">
                    <div className="w-full flex flex-col justify-start items-start gap-2">
                        <label htmlFor="firstName">name</label>
                        <input value={settings.firstName} onChange={(e) => setSettings({ ...settings, firstName: e.target.value })} type="text" name="firstName" id="firstName" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600" />
                    </div>
                    <div className="w-full flex flex-col justify-start items-start gap-2">
                        <label htmlFor="lastName">lastName</label>
                        <input value={settings.lastName} onChange={(e) => setSettings({ ...settings, lastName: e.target.value })} type="lastName" name="lastName" id="lastName" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600" />
                    </div>
                    <div className="w-full flex flex-col justify-start items-start gap-2">
                        <label htmlFor="password">password</label>
                        <input value={settings.password} onChange={(e) => setSettings({ ...settings, password: e.target.value })} type="password" name="password" id="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600" />
                    </div>
                    <div className="w-full flex flex-col justify-start items-start gap-2">
                        <label htmlFor="bio">bio</label>
                        <textarea value={settings.bio} onChange={(e) => setSettings({ ...settings, bio: e.target.value })} name="bio" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600" id="bio"></textarea>
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Submit</button>
                </form>
            </motion.section>
            {error && <p className="text-red-500">{error}</p>}
        </main>
    )
}