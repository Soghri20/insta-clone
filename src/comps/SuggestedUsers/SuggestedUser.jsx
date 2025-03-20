import { Avatar, Button, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

const SuggestedUser = ({name,followers,avatar}) => {
    const [followed,setFollowed]=useState(false)
  return (
    <Flex justifyContent={'space-between'} alignItems={'center'} w={'full'}>
        <Flex alignItems={'center'} gap={2}>
             <Avatar.Root size={'md'}>     
                <Avatar.Image src={avatar} />
             </Avatar.Root>
             <Flex  flexDirection={'column'}>
                <Text fontSize={13} color={"gray.800"} fontWeight={'bold'}>{name}</Text>
                <Text color={'gray.400'} fontWeight={400} fontSize={9}>{followers} follower</Text>
             </Flex>
        </Flex>
        
        <Button onClick={()=>setFollowed(!followed)} bgColor={'transparent'} _hover={{color:'blue.500',transition:'all .3s ease-in-out'}} fontSize={13} color={'blue.600'} fontWeight={'semibold'} >{followed ? 'Unfollow':'Follow'}</Button>
      
    </Flex>
  )
}

export default SuggestedUser
