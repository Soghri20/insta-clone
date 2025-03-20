import { Avatar, Box, Button, Flex, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import SuggestedHeader from './SuggestedHeader'
import SuggestedUser from './SuggestedUser'
import useAuthStatus from '@/hooks/useAuthStatus'
import { supabase } from '@/utils/supabase'
import useAuthStore from '@/store/authStore'
const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const {user}=useAuthStatus();
  const userId=user?.id;
  // Fetch users who are not followed by the logged-in user
  const getSuggestedUsers = async () => {
    try {
      // Fetch all users
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*'); // Replace with your profiles table name

      if (usersError) {
        console.error("Error fetching users:", usersError);
        return;
      }

      // Fetch followed users
      const { data: followsData, error: followsError } = await supabase
        .from('followers')
        .select('following_id') // Assuming followed_user_id is the user being followed
        .eq('follower_id', userId); // Get users followed by the logged-in user

      if (followsError) {
        console.error("Error fetching followed users:", followsError);
        return;
      }

      const followedUserIds = followsData.map(follow => follow.followed_user_id);

      // Filter out users who are already followed by the logged-in user
      const filteredUsers = allUsers.filter(user => !followedUserIds.includes(user.id) && user.id !== userId);

      setSuggestedUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  // Handle following a user
  const handleFollow = async (followedUserId) => {
    try {
      const { data, error } = await supabase
        .from('followers')
        .insert([
          {
            following_id: userId,
            follower_id: followedUserId,
          },
        ]);

      if (error) {
        console.error("Error following user:", error);
      } else {
        setFollowedUsers(prev => [...prev, followedUserId]); // Add user to followed list
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getSuggestedUsers(); // Fetch suggestions when the userId changes
    }
  }, [userId]);
  return (
    <VStack py={8} px={6} gap={4} zIndex={0} >
      <SuggestedHeader  />
      <Flex alignItems={'center'} justifyContent={'space-between'} w={'full'}>
        <Text fontSize={12} fontWeight={'semibold'} color={'gray.500'}>
          Suggested for you
        </Text>
       
      </Flex>

      {/* Display suggested users */}
      {suggestedUsers.map(user => {
       
      return  <Box key={user.id} mb={4} w={'full'}>
          <Flex alignItems={'center'} justifyContent={'space-between'}>
            <Flex alignItems={'center'} >
              {/* <Avatar size="sm" src={user.avatar_url} /> */}
                 <Avatar.Root size={'sm'}>
                                <Avatar.Image src={user.avatar} />
                            </Avatar.Root>
              <Text ml={3} fontWeight="semibold">{user.fullname}</Text>
            </Flex>
            <Button
              size="xs"
              bgColor="blue.700"
              onClick={() => handleFollow(user.id)}
            >
              Follow
            </Button>
          </Flex>
        </Box>
      })}

      <Box alignSelf={'start'} fontSize={12} color={'gray.500'} mt={5}>
        2025 Build by Othmane Soghri
      </Box>
    </VStack>
  )
}

export default SuggestedUsers
