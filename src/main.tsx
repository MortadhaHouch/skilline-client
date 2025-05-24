import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import About from './pages/About.tsx'
import Home from './pages/Home.tsx'
import Contact from './pages/Contact.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Features from './pages/Features.tsx'
import NotFound from './pages/NotFound.tsx'
import MainAdminDashboard from './pages/MainAdminDashboard.tsx'
import Profile from './pages/Profile.tsx'
import Settings from './pages/Settings.tsx'
import Notifications from './pages/Notifications.tsx'
import Communities from './pages/Communities.tsx'
import Community from './components/main/Community.tsx'
import UserDashboard from './pages/UserDashboard.tsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/features" element={<Features />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<MainAdminDashboard/>}/>
        <Route path='profile' element={<Profile/>}/>
        <Route path='communities' element={<Outlet/>}>
          <Route index element={<Communities/>}/>
          <Route path=':id' element={<Community/>}/>
        </Route>
        <Route path='settings' element={<Settings/>}/>
        <Route path='notifications' element={<Notifications/>}/>
      </Route>
      <Route path="/user-dashboard" element={<Dashboard />}>
        <Route index element={<UserDashboard/>}/>
        <Route path='profile' element={<Profile/>}/>
        <Route path='communities' element={<Outlet/>}>
          <Route index element={<Communities/>}/>
          <Route path=':id' element={<Community/>}/>
        </Route>
        <Route path='settings' element={<Settings/>}/>
        <Route path='notifications' element={<Notifications/>}/>
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
