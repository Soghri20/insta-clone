import { VStack, Input, Button, Alert, Text, Box, Heading } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useSignUpWithEmailAndPassword from '@/hooks/useSignUpWithEmailAndPassword';
import useAuthStatus from '@/hooks/useAuthStatus';
import { supabase } from '@/utils/supabase';
import { useNavigate } from 'react-router-dom';

const CompleteSignUp = () => {
  const {user}=useAuthStatus()
  const [loader,setLoader]=useState(true)
  const navigate = useNavigate()
  const [input, setInput] = useState({
    email: '',
    fullname: '',
    username: '',
    bio: '',
  });
  
  const { loading, error, signUp } = useSignUpWithEmailAndPassword();
  const { email, fullname, username, bio } = input;

  const onChange = (target) => {
    setInput((prev) => ({
      ...prev,
      [target.id]: target.value,
    }));
  };
  useEffect(()=>{
    const checkUserExists = async (userId) => {
      setLoader(true)
      try {
        // Query the profiles table to check if the user already exists
        const { data, error, status } = await supabase
          .from('profiles')
          .select('id')  // You can select any field that can uniquely identify the user, like `id`
          .eq('id', userId)  // Assuming 'user_id' is the column for the unique user identifier
          .single();  // Use .single() to ensure you only get one row or null if not found
    
        if (error && status !== 406) {
          console.error('Error checking user existence:', error.message);
          return null;
        }
    
        if (data) {
          console.log('User exists in profiles table:', data);
         return  navigate('/home')
         
        }

        setLoader(false)
        console.log('User does not exist in profiles table');
      } catch (error) {
        console.error('Error during user existence check:', error.message);
        return null;
      }
    };
    checkUserExists(user?.id)
  },[user])

  if(loader && loading) return 'loading'
 if(!loader && !loading) return (
    <Box maxW="md" mx="auto" p={6} mt={10} bg="white" rounded="lg" boxShadow="lg">
      <Heading textAlign="center" mb={6} fontSize="2xl" color="blue.500">
        Complete Your Sign Up
      </Heading>
      <Text textAlign="center" mb={6} fontSize="sm" color="gray.600">
        Create your account and start sharing moments with friends and family!
      </Text>

      {error && (
        <Alert status="error" mb={4}>
          <Alert.Description>{error.message}</Alert.Description>
        </Alert>
      )}

      <VStack spacing={4} align="stretch">
        <Input 
          placeholder="Full Name"
          type="text"
          value={fullname}
          id='fullname'
          onChange={(e) => onChange(e.target)}
          fontSize={14}
        />
        <Input
          placeholder="Username"
          type="text"
          value={username}
          id='username'
          onChange={(e) => onChange(e.target)}
          fontSize={14}
        />
        <Input
          placeholder="Email"
          type="email"
          id='email'
          value={email}
          onChange={(e) => onChange(e.target)}
          fontSize={14}
        />
        <Input
          placeholder="Tell us a little about yourself"
          type="text"
          id='bio'
          value={bio}
          onChange={(e) => onChange(e.target)}
          fontSize={14}
        />

        <Button
          isLoading={loading}
          loadingText="Signing up..."
          onClick={() => signUp(input)}
          w="full"
          colorScheme="blue"
          size="lg"
          fontSize={14}
        >
          Complete Sign Up
        </Button>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          By signing up, you agree to our <b>Terms & Conditions</b>.
        </Text>
      </VStack>
    </Box>
  );
};

export default CompleteSignUp;

