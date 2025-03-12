import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import About from './pages/About.tsx'
import Home from './pages/Home.tsx'
import Contact from './pages/Contact.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Features from './pages/Features.tsx'
import NotFound from './pages/NotFound.tsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/features" element={<Features />} />
      {
        JSON.parse(localStorage.getItem("isLoggedIn")||"false")?(
          <Route path="/dashboard" element={<Dashboard />} />
        ):(
          <>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </>
        )
      }
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
