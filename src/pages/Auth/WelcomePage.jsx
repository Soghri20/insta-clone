import useAuthStatus from '@/hooks/useAuthStatus';
import { supabase } from '@/utils/supabase';
import { Box, Button, Flex, Text, VStack, Image, Heading } from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';
import { use, useEffect } from 'react';



const WelcomePage = () => {
  const {user} = useAuthStatus()
  const handleGoogleSignUp = async () => {
 
         const { user, session, error } = await supabase.auth.signInWithOAuth({
           provider: 'google',
           redirectTo:"https://insta-clone-zeta-ashy.vercel.app/complete-signin"
          
         });
       
         if (error) {
           console.error('Google sign-in error:', error.message);
         } else {
           console.log('User signed in:', user);
           // check if the user already exist 
           navigate('/complete-signin')
         }
     
  };


  return (
    <Flex
      h="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-r, #fbc2eb, #a6c1ee)" // Gradient background
      px={{ base: 4, md: 8 }} // Add horizontal padding for smaller screens
    >
      <Box
        textAlign="center"
        bg="white"
        p={{ base: 6, sm: 8 }} // Adjust padding based on screen size
        rounded="xl"
        shadow="xl"
        maxW={{ base: "full", sm: "md", lg: "lg" }} // Make the modal responsive
        w="full"
      >
        <VStack spacing={4}>
          {/* Instagram Clone Logo */}
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            boxSize={{ base: "70px", sm: "90px" }} // Adjust logo size for small screens
            alt="Instagram Logo"
          />

          {/* Welcome Text */}
          <Heading
            fontSize={{ base: "xl", sm: "2xl" }}
            fontWeight="bold"
            color="gray.800"
          >
            Welcome to InstaClone!
          </Heading>
          <Text
            fontSize={{ base: "sm", sm: "md" }}
            color="gray.600"
            maxW="lg"
          >
            Share your moments, connect with friends, and explore the world in a new way.
          </Text>
          <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
            Sign up with Google and start your journey today.
          </Text>

          {/* Google Sign-Up Button */}
          <Button
            onClick={handleGoogleSignUp}
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
            leftIcon={
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                boxSize="20px"
              />
            }
            size={{ base: "md", sm: "lg" }}
            fontWeight="medium"
            width="full"
          >
            Sign up with Google
          </Button>

          {/* Small Footer Message */}
          <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.400">
            By signing up, you agree to our Terms & Conditions.
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default WelcomePage;
