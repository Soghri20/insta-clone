import { supabase } from '@/utils/supabase';
import { Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {
  const navigate = useNavigate()

 
    const signInWithGoogle = async () => {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
       
      });
    
      if (error) {
        console.error('Google sign-in error:', error.message);
      } else {
        console.log('User signed in:', user);
        
        
        navigate('/')
      }
    };
  
  return (
     <Flex alignItems={'center'} justifyContent={'center'} cursor={'pointer'}>
            <Image src='/google.png' w={3} />
            <Text mx='2' color={'blue.500'} onClick={signInWithGoogle}>
                Login in with Google
            </Text>
    </Flex>
  )
}

export default GoogleAuth
