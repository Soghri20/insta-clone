import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Input, Textarea, Button, Text, Avatar, Flex, } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/utils/supabase';
import useShowToast from '@/hooks/useShowToast';
import { FaEdit } from "react-icons/fa";
import useAuthStatus from '@/hooks/useAuthStatus';
import { v4 as uuidv4 } from 'uuid'; // Install with `npm install uuid`



const ProfileEditPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const {userId}=useParams()
  const {user}=useAuthStatus()
  const [imageFile,setImageFile]=useState(null)
  const [imagePreview, setImagePreview] = useState(null);
  const [publicUrl,setPublicUrl]=useState(null)
  const [profileData, setProfileData] = useState({
    fullname: '',
    username: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useShowToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (data) {
          setUserProfile(data);
          setProfileData({
            fullname: data.fullname || '',
            username: data.username || '',
            bio: data.bio || '',
          });
        } else {
          console.log('Error fetching profile:', error.message);
        }
      } else {
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview as a base64 string
      };
      reader.readAsDataURL(file);
      console.log(reader.readAsDataURL(file))
    }
  };
  const uploadImage = async (image) => {
    try {
      const fileExtension = image.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `avatars/${fileName}`;
  
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, image, { upsert: true });
  
      if (error) throw error;
  
      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
  
      return data.publicUrl;  // Return directly instead of setting state
    } catch (error) {
      console.error("Upload error:", error.message);
      return null;
    }
  };
  
  const handleSaveProfile = async () => {
    setLoading(true);
  
    if (user) {
      const uploadedImageUrl = imageFile ? await uploadImage(imageFile) : userProfile.avatar;
  
      const formData = {
        ...profileData,
        avatar: uploadedImageUrl,  // Use the returned URL instead of state
      };
  
      const { data, error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', userId)
        .select();
  
      setLoading(false);
  
      if (error) {
        console.error('Failed to update profile!', error.message);
      } else {
        setUserProfile((prev) => ({ ...prev, ...formData }));
        navigate(`/profile/${userId}`); // Navigate to profile page
        setTimeout(() => {
        window.location.reload(); // Reload the page after navigation
    }, 100); // Small delay to ensure navigation happens first
      }
    }
  };
  

  if (!userProfile) return <div>Loading...</div>;

  return (
    <Container maxW="lg" py={10}>
      <Box bg="white" p={6} borderRadius="md" boxShadow="md">
        <Heading as="h2" size="xl" mb={5}>
          Edit Profile
        </Heading>
        <Text mb={4}>Update your profile details below:</Text>
        <Flex  flexDirection={'column'} alignItems={'center'} justifyContent={'center'} p={'3'}>
         <Avatar.Root size={'2xl'} position={'relative'}>
            <Avatar.Fallback name="Segun Adebayo"  />
                <Avatar.Image src={imagePreview ? imagePreview:userProfile.avatar} />
                <Box cursor={'pointer'} onClick={() => document.getElementById('fileInput').click()}
                 position={'absolute'} borderRadius={'full'} shadow={'md'} bottom={-2} right={-2}  bgColor={'gray.100'}  p={2}>
                  <Input id="fileInput" onChange={handleImageChange} type="file" on accept="image/*"display="none" />
                  <FaEdit size={10} />
               </Box>
          </Avatar.Root>
         
        </Flex>
         
        <Input
          id="fullname"
          value={profileData.fullname}
          onChange={handleChange}
          placeholder="Full Name"
          mb={4}
          mt={4}
        />
        <Input
          id="username"
          value={profileData.username}
          onChange={handleChange}
          placeholder="Username"
          mb={4}
        />
        <Textarea
          id="bio"
          value={profileData.bio}
          onChange={handleChange}
          placeholder="Bio"
          mb={4}
          minHeight="100px"
        />
        <Button
          colorScheme="blue"
          onClick={handleSaveProfile}
          isLoading={loading}
          loadingText="Saving..."
          w="full"
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default ProfileEditPage;
