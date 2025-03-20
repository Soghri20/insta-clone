import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SignIn from './CompleteSignUp'
import Login from './CheckProfile'
import GoogleAuth from './GoogleAuth'

const AuthForm = () => {
    const[isLogin,setIsLogin]=useState(true)
   

 
  return (
    <>
      <Box border={'1px solid gray'} borderRadius={4} padding={5}>
        <VStack>
            <Image src='/logo.png' h={24} cursor={'pointer'} alt='logo'/>  
            {isLogin ? <Login /> : <SignIn />}
            <Flex alignItems={'center'} justifyContent={'center'}  my={4} gap={1} w={'full'}>
                <Box flex={2} h={'1px'} bg={'gray.400'} />
                <Text mx={1} color={'black'}>
                    OR
                </Text>
                <Box flex={2} h={'1px'} bg={'gray.400'} />
            </Flex>
           <GoogleAuth />
        </VStack>
      </Box>
      <Box border={'1px solid gray'} borderRadius={5} padding={5}>
        <Flex alignItems={'center'} justifyContent={'center'}>
            <Box spaceX={5}>
                {isLogin ?"Don't have an account ": 'Already have an account'}
            </Box>
            <Box onClick={()=>setIsLogin(!isLogin)} color={'blue.500'}>
                {isLogin ? ' Sign Up' : 'Log in'}
            </Box>
        </Flex>

      </Box>
    </>
  )
}

export default AuthForm
