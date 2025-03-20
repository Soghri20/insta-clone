import useAuthStore from '@/store/authStore'
import { Avatar, Box, Button, Flex, Link, Text } from '@chakra-ui/react'
import React from 'react'
import {Link as RouterLink} from 'react-router-dom'

const SuggestedHeader = () => {
    const {user:userStore,login}=useAuthStore()

  return (
   <Flex justifyContent={'space-between'} w={'full'} alignItems={'center'}>
    <Flex flex={1} gap={2} alignItems={'center'}>
        <Avatar.Root size={'md'}>     
            <Avatar.Image src={userStore?.avatar} />
        </Avatar.Root>
        <Text fontSize={12} fontWeight={'bold'}>{userStore?.fullname}</Text>
    </Flex>
    <Link to={'/AuthPage'} _hover={{textDecoration:'none'}} as={RouterLink}>
        <Button bgColor={'transparent'} color={'blue.600'} fontWeight={'semibold'} >Log out</Button>
    </Link>

   </Flex>
  )
}

export default SuggestedHeader
