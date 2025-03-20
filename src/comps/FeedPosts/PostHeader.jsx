import useDate from '@/hooks/useDate'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const PostHeader = ({profile}) => {
 const {Dating}=useDate()
  
  return (
    <Flex justifyContent={'space-between'} gap={3} mb={2} alignItems={'center'}>
        <Flex alignItems={'center'}>
            <Avatar.Root size={'sm'}>
                  <Avatar.Image src={profile.avatar} />
              </Avatar.Root>
           <Flex fontSize={12} gap={1}>
             <Text fontWeight={'semibold'} px={2} >{profile.username}</Text>
             <Box color={'gray.500'}>{ Dating(profile.created_at)}</Box>
           </Flex>
        </Flex>
        

    </Flex>
  )
}

export default PostHeader
