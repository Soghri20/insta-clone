import { CreatePostLogo, InstagramLogo ,InstagramMobileLogo, NotificationsLogo, SearchLogo} from '../../assets/constants'
import { Avatar, Box, Button, Dialog, Drawer, Flex, Input, Link, Text,Float } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate,Link as RouterLink} from 'react-router-dom'
import { Tooltip } from '@/components/ui/tooltip'
import { GoHomeFill } from "react-icons/go";
import { BiLogOut } from 'react-icons/bi'
import useLogout from '@/hooks/useLogout'
import { supabase } from '@/utils/supabase'
import useAuthStatus from '@/hooks/useAuthStatus'
import CreatePost from '../FeedPosts/CreatePost'
import useAuthStore from '@/store/authStore'
import { usePostsStore } from '@/store/postsStore'

const Sidebar = () => {
  const {logout} = useLogout()
  const {user,loading}=useAuthStatus()
  const[profile,setProfile]=useState(null)
  const [loader,setLoader]=useState(false)
  const [showSidebar,setShowSidebar]=useState(null);
  const {user:userStore,login}=useAuthStore()
  const navigate =  useNavigate()
  const {notification,RemNoti}=usePostsStore()
  console.log(notification)
    
  useEffect(()=>{
    const fetchUser = async () =>{
      setLoader(true)
      try {
        // Step 1: Check if user exists
        const { data: existingUser, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();
    
        if (userError || !existingUser) {
          console.error("User not found:", userError?.message);
          return;
        }
        setProfile(existingUser)
        login(existingUser)
    }catch(error){
      console.log(error)
    }
    setLoader(false)
  }
  if(!loading) fetchUser()
  },[loading])
  const SidebarItems = [
    {
      icon:<GoHomeFill style={{fontSize:'23px'}} />,
      text:'Home',
      link:'/'
    },
    {
      icon:<SearchLogo />,
      text:'Search',
      link:'search'
      
    },{
      icon:<NotificationsLogo />,
      text:'Notifications',
      link:'notification'
      
    },
    {
      icon:<CreatePostLogo />,
      link:'/create-post',
      text:'Create',
      
    },{
      icon:<Avatar.Root size={'sm'}>
      <Avatar.Fallback name="Segun Adebayo" />
        <Avatar.Image src={profile?.avatar } />
    </Avatar.Root>,
      text:'Profile',
      link:'/profile'
    },
  ]
  if(loading) return 'loading'
  
 
 
  return (
    <Box height={'100vh'} borderRight={'1px solid'} borderColor={"gray.200"} py={8} position={'sticky'} top={0} left={0} px={{base:2,md:4}}>
    <Flex direction={'column'} gap={10} w='full' height={'full'}>
       <Link to='/' as={RouterLink} pl={2} display={{base:'none',md:'block'}} cursor={'pointer'}>
           <InstagramLogo  />
       </Link>
       <Link to='/' as={RouterLink} pl={2} display={{base:'block',md:'none'}} cursor={'pointer'} borderRadius={6} _hover={{ bg:'whiteAlpha.200' }} w={10}>
           <InstagramMobileLogo />
       </Link>
    
    <Flex direction={'column'} gap={5} cursor={'pointer'}>
    
      {SidebarItems.map((item,index)=>(
         <Tooltip key={index} showArrow ml={1} positioning={{ placement: "right-end" }} openDelay={500} closeDelay={100} display={{base:'block',md:'none'}} content={item.text}>
             <Link onClick={''} to={item.link==='/profile' ? `${item.link}/${profile?.id}/posts` : item.link} as={RouterLink} display='flex' justifyContent={{base:'center',md:'flex-start'}} alignItems='center' gap={4} _hover={{ bg: 'whiteAlpha.400' }} p={2} w={{base:10,md:'full'}} borderRadius={6}>
              {/* {item.icon} */}
              {item.text ==='Notifications' ? <Box position={'relative'} onClick={RemNoti}>
                <Box >{item.icon}</Box>
                {notification && <Flex justifyContent={'center'} alignItems={'center'} bgColor={'red.500'} p={0} color={'white'} width={'12px'} height={'12px'} fontSize={'xs'} borderRadius={'full'} position={'absolute'} top={0} right={-1}></Flex>}
              </Box>:(<>{item.icon}</>)}
             <Box display={{ base: 'none', md: 'block' }}>{item.text}</Box>           
           </Link>
          
      </Tooltip>
      ))}
    </Flex>
    <Tooltip showArrow ml={1} positioning={{ placement: "right-end" }} openDelay={500} closeDelay={100} display={{base:'block',md:'none'}} content={'Log Out'}>
        <Flex onClick={()=>logout()} display='flex' mt={'auto'} justifyContent={{base:'center',md:'flex-start'}} alignItems='center' gap={4} _hover={{ bg: 'whiteAlpha.400' }} p={2} w={{base:10,md:'full'}} borderRadius={6}>
          <BiLogOut size={25} />
           <Button variant={'ghost'} _hover={{bg:'transparent'}} loading={loading} display={{ base: 'none', md: 'block' }}>Log Out</Button>
       </Flex>
    </Tooltip>
    </Flex>
  
   </Box>
    
  )
}

export default Sidebar
