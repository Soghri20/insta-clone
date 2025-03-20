import { Box, Flex } from '@chakra-ui/react'
import Sidebar from '../../../comps/Sidebar/Sidebar'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { supabase } from '@/utils/supabase'
import useAuthStore from '@/store/authStore'
import useAuthStatus from '@/hooks/useAuthStatus'
import Navbar from '@/comps/Navbar/Navbar'

const PageLayout = ({children}) => {
    const {pathname} = useLocation()
    const {user,loading}=useAuthStatus(null)
    const canRenderSidebar = pathname !== '/' && pathname !== '/welcome' ;
  
  return (
    <Flex>
        {/* sidebar on the left */}
     {canRenderSidebar && (
      <Box w={{base:'70px',md:'240px'}}>
        <Sidebar />
     </Box>
     )}
   
     {/* the page content */}
     <Box flex={1} mx={'auto'}  w={{base:'calc(100%-70px)',md:'calc(100%-240px'}}>
        {children}
     </Box>
    </Flex>
  )
}

export default PageLayout
