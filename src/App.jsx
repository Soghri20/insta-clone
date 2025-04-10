import { Button } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePages.jsx/HomePage"
import AuthPage from "./pages/Auth/AuthPage"
import PageLayout from "./pages/layouts/PageLayout/PageLayout"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import { Toaster } from "@/components/ui/toaster"
import useAuthStore from "./store/authStore"
import useAuthStatus from "./hooks/useAuthStatus"
import { useEffect } from "react"
import { supabase } from "./utils/supabase"
import WelcomePage from "./pages/Auth/WelcomePage"
import CheckProfile from "./comps/AuthForm/CheckProfile"
import ProfileEditPage from "./pages/ProfilePage/ProfileEditPage"
import CreatePost from "./comps/FeedPosts/CreatePost"
import NotificationsPage from "./comps/notfication/NotificationsPage"
import SearchPage from "./comps/search/SearchPage"
import CompleteSignUp from "./comps/AuthForm/CompleteSignUp"


function App() {
  const {user,loading}=useAuthStatus()
 
  if(loading) return 'loading'
  
  return (
    <PageLayout>
       <Routes>
        <Route path='/welcome' element={!user ? <WelcomePage /> : <HomePage />} />
         <Route path='/home' element={user ? <HomePage /> : <Navigate to='/welcome' />}/> 
         <Route path='/notification' element={user ? <NotificationsPage /> : <Navigate to='/welcome' />}/>
         <Route path='/search' element={user ? <SearchPage /> : <Navigate to='/welcome' />}/> 
 

         <Route path='/create-post' element={user ? <CreatePost /> : <Navigate to='/welcome' />}/> 

         {/* <Route path='/AuthPage' element={<AuthPage />}/> */}
         <Route path='/' element={<CheckProfile><CompleteSignUp /></CheckProfile>} />
         <Route path='/profile/:id/:area' element={user ?<ProfilePage /> : <Navigate to='/welcome' />}/>
         <Route path='/edit-profile/:userId' element={user ? <ProfileEditPage /> : <WelcomePage />} />

      </Routes>
      <Toaster />
    </PageLayout>
   
  )
}

export default App
