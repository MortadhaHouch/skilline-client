import { FormEvent, useState, useEffect } from "react";
import SettingsImage from "../../public/assets/images/Update.svg";
import fetchData from "../../utils/fetchData";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

interface UserSettings {
  firstName?: string;
  lastName?: string;
  password?: string;
  bio?: string;
  interests?: string[];
}

interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
  isLoggedIn: boolean;
  createdAt: string;
  updatedAt: string;
  interests: string[];
  index: number;
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    firstName: "",
    lastName: "",
    password: "",
    bio: "",
    interests: [],
  });
  const [newInterest, setNewInterest] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["auth_token"]);

  // Load initial user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const decoded = jwtDecode<{ email: string }>(cookies.auth_token);
        const userData = await fetchData(
          `/user/${decoded.email}`,
          "GET",
          {},
          cookies.auth_token,
          "json",
          "json"
        );
        setSettings({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          bio: userData.bio || "",
          interests: userData.interests || [],
        });
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    };
    if (cookies.auth_token) {
      loadUserData();
    }
  }, [cookies.auth_token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const filteredSettings = Object.fromEntries(
        Object.entries(settings).filter(([_, value]) => value !== "" && value !== undefined)
      );

      const request = await fetchData(
        `/user/${jwtDecode<{_id:string}>(cookies.auth_token)._id}`,
        "PUT",
        filteredSettings,
        cookies.auth_token,
        "json",
        "json"
      );

      if (request.message === "User updated successfully") {
        setSuccess("Settings updated successfully!");
        const updatedUser = request.user as UserResponse;
        setSettings((prev) => ({
          ...prev,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          bio: updatedUser.bio,
          interests: updatedUser.interests,
        }));
        // Update localStorage if used elsewhere
        localStorage.setItem("firstName", updatedUser.firstName);
        localStorage.setItem("lastName", updatedUser.lastName);
        localStorage.setItem("bio", updatedUser.bio || "");
        localStorage.setItem("interests", JSON.stringify(updatedUser.interests));
      }
    } catch (error: any) {
      console.error("Update error:", error);
      setError(error.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !settings.interests?.includes(newInterest.trim())) {
      setSettings((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setSettings((prev) => ({
      ...prev,
      interests: prev.interests?.filter((i) => i !== interest) || [],
    }));
  };

  return (
    <main className="flex flex-row items-center justify-center flex-wrap w-screen gap-4 min-h-screen p-4">
      <motion.img
        src={SettingsImage}
        alt="Settings Illustration"
        className="w-[clamp(320px,60%,450px)]"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { x: -100, scale: 0.75, opacity: 0.5 },
          visible: { x: 0, scale: 1, opacity: 1, transition: { duration: 0.5 } },
        }}
      />
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { x: 100, scale: 0.75, opacity: 0.5 },
          visible: { x: 0, scale: 1, opacity: 1, transition: { duration: 0.5 } },
        }}
        className="flex flex-col items-center justify-center w-[clamp(320px,60%,450px)] bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl md:text-4xl font-semibold text-blue-700 dark:text-blue-300 mb-6">
          Settings
        </h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              value={settings.firstName}
              onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
              type="text"
              name="firstName"
              id="firstName"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter first name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              value={settings.lastName}
              onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
              type="text"
              name="lastName"
              id="lastName"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter last name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              value={settings.password}
              onChange={(e) => setSettings({ ...settings, password: e.target.value })}
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter new password"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              name="bio"
              id="bio"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-200 min-h-[100px]"
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 dark:text-gray-300">Interests</label>
            <div className="flex gap-2">
              <input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                type="text"
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Add an interest"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {settings.interests?.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center gap-2"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2 ${
              loading ? "cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Updating...
              </>
            ) : (
              "Update Settings"
            )}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </motion.section>
    </main>
  );
}