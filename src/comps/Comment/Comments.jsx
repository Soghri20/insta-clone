import { Tooltip } from '@/components/ui/tooltip';
import useAuthStatus from '@/hooks/useAuthStatus';
import useShowToast from '@/hooks/useShowToast';
import { supabase } from '@/utils/supabase';
import { Flex, Text,Avatar, Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { MdOutlineMoreHoriz } from "react-icons/md";


const Comments = ({createdAt,username,profilePic,text,userId,commentId}) => {
  const [owner,setOwner]=useState(false);
  const {user,loading}=useAuthStatus();
  const {showToast}=useShowToast()

  useEffect(()=>{
    if(loading) return ;
    if(user?.id===userId){
      setOwner(true)
    }
  },[loading])
 
  const deleteComment = async ()=>{
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if(error) {

      showToast('error deleting','try another time','error')
      return
    }
    showToast('comment deleted','','success')
    window.location.reload(); // Reload the page after navigation


  }
  return (
    <Flex gap={4} w={'full'} mt={1}  alignItems={'center'}>
         <Avatar.Root size={'sm'}>
            <Avatar.Image src={profilePic}/>
         </Avatar.Root>
         <Flex direction={'column'} flex={1} >
            <Flex alignItems={'center'} gap={1} >
                <Text fontWeight={'bold'} fontSize={12} >
                    {username}
                </Text>
                <Text fontSize={12} fontWeight={'semibold'} color={'gray'}  maxW="250px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                    {text}
                </Text>
            </Flex>
            <Text fontSize={10} color={'gray'}>
                    {createdAt}
            </Text>
         </Flex>
         {owner && <Box onClick={deleteComment}>
          <Tooltip showArrow ml={1} positioning={{ placement: "right-end" }} openDelay={500}
            closeDelay={100} display={{base:'block',md:'none'}}  content={'delete'}>
             <MdOutlineMoreHoriz />
          </Tooltip>
         </Box>}
    </Flex>
  )
}

export default Comments
