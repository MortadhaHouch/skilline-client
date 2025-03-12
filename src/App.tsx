import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/main/Header'
import Footer from './components/main/Footer'
import ThemeContextProvider, { ThemeContext } from './providers/ThemeContext'
import { LoginProvider } from './providers/LoginContext'
import { useContext, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CookiesProvider } from 'react-cookie';
function App() {
  const {setTheme} = useContext(ThemeContext);
  const toggleDarkMode = () => {
    setTheme(JSON.parse(localStorage.getItem("theme") || "false"));
    document.documentElement.classList.toggle('dark',JSON.parse(localStorage.getItem("theme") || "false"));
  };
  useEffect(()=>{
    toggleDarkMode();
  },[])
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
