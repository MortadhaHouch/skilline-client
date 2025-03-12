import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaCircleInfo } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { BiLogIn } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { ThemeContext } from '@/providers/ThemeContext';
import LoginContext from '@/providers/LoginContext';
import { useCookies } from 'react-cookie';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {theme,setTheme} = useContext(ThemeContext);
  const {isLoggedIn,setIsLoggedIn} = useContext(LoginContext)
  const [cookies] = useCookies(["auth_token"])
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setTheme((v)=>!v);
    localStorage.setItem('theme', JSON.stringify(theme));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.clear()
  };

  return (
    <header className="sticky top-0 left-0 z-50 flex items-center justify-between w-full px-4 py-3 shadow-md backdrop-blur-md md:px-6">
      <div className="flex flex-row items-center justify-center gap-2">
        <h1>
          <Link to="/home" className="text-xl font-bold tracking-wide transition-colors hover:text-blue-400 md:text-2xl">
            Skilline
          </Link>
        </h1>
      </div>
      <nav className="hidden md:flex">
        <ul className="flex items-center gap-4 md:gap-6">
          <li><Link to="/home" className="flex flex-row items-center justify-center gap-2 nav-link"><FaHome /><span>Home</span></Link></li>
          <li><Link to="/features" className="flex flex-row items-center justify-center gap-2 nav-link"><FaWandMagicSparkles /><span>Features</span></Link></li>
          <li><Link to="/about" className="flex flex-row items-center justify-center gap-2 nav-link"><FaCircleInfo /><span>About</span></Link></li>
          <li><Link to="/contact" className="flex flex-row items-center justify-center gap-2 nav-link"><FaPhoneAlt /><span>Contact</span></Link></li>
          {isLoggedIn || cookies.auth_token ? (
            <>
              <li><Link to="/dashboard" className="flex flex-row items-center justify-center gap-2 nav-link"><MdDashboard /><span>Dashboard</span></Link></li>
              <li><button onClick={logout} className="flex flex-row items-center justify-center gap-2 nav-link"><CiLogout /><span>Logout</span></button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="flex flex-row items-center justify-center gap-2 nav-link"><IoMdLogIn /><span>Login</span></Link></li>
              <li><Link to="/signup" className="flex flex-row items-center justify-center gap-2 nav-link"><BiLogIn /><span>Sign Up</span></Link></li>
            </>
          )}
        </ul>
      </nav>
      <button onClick={toggleDarkMode} className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
        {theme ? '🌞' : '🌙'}
      </button>
      <button onClick={toggleMenu} className="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-400 p-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {isMenuOpen && (
        <nav className="absolute left-0 right-0 w-full py-4 transition-transform transform shadow-md md:hidden top-full bg-slate-300 dark:bg-slate-500 backdrop-opacity-70 backdrop-blur-lg">
          <ul className="flex flex-col items-start justify-start gap-2 p-3 md:gap-6">
            <li><Link to="/home" className="flex flex-row items-center justify-center gap-2 nav-link"><FaHome /><span>Home</span></Link></li>
            <li><Link to="/features" className="flex flex-row items-center justify-center gap-2 nav-link"><FaWandMagicSparkles /><span>Features</span></Link></li>
            <li><Link to="/about" className="flex flex-row items-center justify-center gap-2 nav-link"><FaCircleInfo /><span>About</span></Link></li>
            <li><Link to="/contact" className="flex flex-row items-center justify-center gap-2 nav-link"><FaPhoneAlt /><span>Contact</span></Link></li>
            {!isLoggedIn ? (
              <>
                <li><Link to="/login" className="flex flex-row items-center justify-center gap-2 nav-link"><IoMdLogIn /><span>Login</span></Link></li>
                <li><Link to="/signup" className="flex flex-row items-center justify-center gap-2 nav-link"><BiLogIn /><span>Sign Up</span></Link></li>
              </>
            ) : (
              <>
                <li><Link to="/dashboard" className="flex flex-row items-center justify-center gap-2 nav-link"><MdDashboard /><span>Dashboard</span></Link></li>
                <li><button onClick={logout} className="flex flex-row items-center justify-center gap-2 nav-link"><CiLogout /><span>Logout</span></button></li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
