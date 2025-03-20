import useAuthStatus from '@/hooks/useAuthStatus'
import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { BsBookmark, BsGrid3X2Gap, BsSuitHeart } from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'

const ProfileTabs = () => {
  const {user}=useAuthStatus()
  const {area}=useParams()
  return (
    <Flex w={'full'} justifyContent={'center'} gap={{base:4,sm:10}} 
    textTransform={'uppercase'} fontWeight={'bold'}>
       <Link to={`/profile/${user?.id}/posts`}  > <Flex borderTop={area=='posts' ? '1px solid gray':null} alignItems={'center'} p='3' gap={1} cursor={'pointer'}>
            
           <Box fontSize={20} >
                <BsGrid3X2Gap/>
           </Box>
           
           <Text fontSize={12} display={{base:'none',sm:'block'}}>Posts</Text>
          
        </Flex>
         </Link>
       <Link  to={`/profile/${user?.id}/saved`} > <
        Flex borderTop={area=='saved' ? '1px solid gray':null} alignItems={'center'} p='3' gap={1} cursor={'pointer'}>
           
            <Box fontSize={20} >
                <BsBookmark/>
           </Box>
            <Text fontSize={12} display={{base:'none',sm:'block'}}>Saved</Text>
          
        </Flex>
         </Link>
         <Link to={`/profile/${user?.id}/likes`} >
          <Flex borderTop={area=='likes' ? '1px solid gray':null} alignItems={'center'} p='3' gap={1} cursor={'pointer'}>
            
             <Box fontSize={20} >
                <BsSuitHeart fontWeight={'bols'}/>
           </Box>
           <Text fontSize={12} display={{base:'none',sm:'block'}}>Likes</Text>
         
        </Flex>
          </Link>
       
    </Flex>
  )
}

export default ProfileTabs
