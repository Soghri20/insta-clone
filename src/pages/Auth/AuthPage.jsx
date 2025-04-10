import AuthForm from '../../comps/AuthForm/AuthForm'
import { Box, Container, Flex, Image, VStack } from '@chakra-ui/react'
import React from 'react'

const AuthPage = () => {
  return (
    <Flex minH={'100vh'}   justifyContent={'center'} alignItems={'center'} px={4}>
        <Container maxW={'container.md'} padding={0}>
          <Flex justifyContent={'center'} alignItems={'center'} gap={10}>
            <Box display={{base:'none',md:'block'}}>
                <Image src='/auth.png' h={500}/>
            </Box>
            <VStack height={500} align={'stretch'}>
              <AuthForm />
              <Box textAlign={'center'}>Get the App.</Box>
              <Flex gap={5} justifyContent={'center'}>
                <Image src='/playstore.png' h={'10'} alt='play store' />
                <Image src='/microsoft.png' h={'10'} alt='play store' />

              </Flex>
            </VStack>
          </Flex>
            

           
        </Container>
    </Flex>
  )
}

export default AuthPage
