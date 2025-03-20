import React, { useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import { Container, Flex } from '@chakra-ui/react';
import ProfileTabs from './ProfileTabs';
import ProfilePosts from './ProfilePosts';
import { useParams } from 'react-router-dom';
import { supabase } from '@/utils/supabase';
import { usePostsStore } from '@/store/postsStore';

const ProfilePage = () => {
  const { id ,area} = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

    
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select("*")
          .eq('id', id)
          .single(); // Ensure a single object is returned

        if (error) {
          console.error("Supabase Error:", error.message);
          return;
        }

        setProfile(data); // Set the user profile data
      } catch (error) {
        console.error("Fetch Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

 
  if (loading) return <p>Loading...</p>; // Show loading indicator while fetching

  return (
    <Container maxW="container.lg" py={5}>
      <Flex py={10} px={4} pl={{ base: 4, md: 10 }} w={'full'} mx={'auto'} flexDirection={'column'}>
        {profile ? <ProfileHeader profile={profile} /> : <p>User not found</p>}
      </Flex>
      <Flex
        px={{ base: 2, sm: 4 }}
        maxW={'full'}
        borderTop={'1px solid'}
        borderColor={'whiteAlpha.300'}
        direction={'column'}
      >
        <ProfileTabs  />
         <ProfilePosts profileId={id} />
      </Flex>
    </Container>
  );
};

export default ProfilePage;
