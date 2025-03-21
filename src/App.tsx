import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/main/Header'
import Footer from './components/main/Footer'
import ThemeContextProvider, { ThemeContext } from './providers/ThemeContext'
import { LoginProvider } from './providers/LoginContext'
import { useContext, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CookiesProvider, useCookies } from 'react-cookie';
import Lenis from 'lenis'
import { jwtDecode } from 'jwt-decode'
function App() {
  const {setTheme} = useContext(ThemeContext);
  const [cookies] = useCookies(["auth_token"]);

  const toggleDarkMode = () => {
    setTheme(JSON.parse(localStorage.getItem("theme") || "false"));
    document.documentElement.classList.toggle('dark',JSON.parse(localStorage.getItem("theme") || "false"));
  };
  const checkTokenExpiry = () => {
    if (window.location.pathname === "/login") return;
    const token = cookies.auth_token;
    if (!token) {
      localStorage.clear();
      window.location.replace("/login");
      return;
    }
    const decoded = jwtDecode<{ exp: number }>(token);
    const expiryDate = new Date(decoded?.exp * 1000);
    const now = new Date();
    if (expiryDate < now) {
      localStorage.clear();
      window.location.replace("/login");
    }
  };
  useEffect(()=>{
    toggleDarkMode();
    checkTokenExpiry();
  },[])
  useEffect(() => {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Example easing function
        smoothWheel:true,
        autoResize:true,
        gestureOrientation:"both",
    })
    function raf(time:number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => {
        lenis.destroy()
    }
}, [])
  return (
    <CookiesProvider>
      <ThemeContextProvider>
        <LoginProvider>
          <AnimatePresence>
            <Header/>
            <Outlet/>
            <Footer/>
          </AnimatePresence>
        </LoginProvider>
      </ThemeContextProvider>
    </CookiesProvider>
  )
}

export default App
