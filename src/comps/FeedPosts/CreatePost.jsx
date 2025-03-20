import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  Text,
  Image,
  Icon,
  Field,
  Fieldset,
  Flex,
} from "@chakra-ui/react";
import { FaCamera, FaImage, FaPencilAlt, FaUsers } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import useAuthStatus from "@/hooks/useAuthStatus";
import useShowToast from "@/hooks/useShowToast";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from 'uuid'; // Install with `npm install uuid`
import { useNavigate } from "react-router-dom";


const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const {user}=useAuthStatus()
  const {showToast} = useShowToast();
  const navigate= useNavigate()
  const uploadImage = async (image) => {
    try {
      const fileExtension = image.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `posts/${fileName}`;
  
      const { error } = await supabase.storage
        .from('posts')
        .upload(filePath, image, { upsert: true });
  
      if (error) throw error;
  
      // Get the public URL
      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);
  
      return data.publicUrl;  // Return directly instead of setting state
    } catch (error) {
      console.error("Upload error:", error.message);
      return null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSubmit = async () => {
    if (!title || !image) {
      showToast('field empty',"Title and image are required!",'error');
      return;
    }
    await uploadImage(setImage)
    const uploadedImageUrl = await uploadImage(image) 
    const formData = {
        user_id:user?.id,
        title:title,
        image:uploadedImageUrl
    }
  
        const { data, error } = await supabase.from('posts').insert(formData);

        if(error){
            showToast('error',"upload fails!",'error');
            return
        }
          showToast('update',"update success!",'success');
          console.log(data);
          navigate('/home');
        
    
  
    // Reset form
    setTitle("");
    setImage(null);
    setImagePreview(null);
  };

  return (
    <Container maxW={'2xl'} centerContent py={6}>
      <Box w="full" p={4} borderRadius="md" boxShadow="lg">
        <Heading as="h2" size="2xl" textAlign="center" mb={4}>
          Create Post
        </Heading>
      
        <Text fontSize="md" border={'1px solid grey.100'} fontWeight={'bold'} color="gray.600" textAlign="center"  bgClip="text" bgGradient="to-r" gradientFrom="red.500" gradientTo="purple.500"  mb={4}>
          Share your moments with your followers by uploading an image and adding a title. 
          Once posted, your followers will see your update, engage with it, and connect with your content.
        </Text>

        <Fieldset.Root>
          <Fieldset.Legend> Happy post</Fieldset.Legend>

          {/* Title Input */}
          <Field.Root mt={4}>
            <Field.Label> <FaPencilAlt size={16} style={{ marginRight: "6px" }} />Title</Field.Label>
            <Input
              placeholder="Enter a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field.Root>

          {/* Image Upload */}
          <Field.Root mt={4}>
            <Field.Label>  <FaImage size={16} style={{ marginRight: "6px" }} /> Upload Image</Field.Label>
            <Box
              w="full"
              h="250px"
              border="2px dashed gray"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              overflow="hidden"
              position="relative"
              bg="gray.100"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              ) : (
                <VStack>
                  <Icon as={LuUpload} boxSize={8} />
                  <Text>Tap to upload</Text>
                </VStack>
              )}
              <Input
                type="file"
                accept="image/*"
                position="absolute"
                top="0"
                left="0"
                w="full"
                h="full"
                opacity="0"
                cursor="pointer"
                onChange={handleImageChange}
              />
            </Box>
          </Field.Root>
        </Fieldset.Root>

        {/* Post Button */}
        <Button
          colorScheme="blue"
          mt={6}
          w="full"
          onClick={handleSubmit}
          isDisabled={!title || !image}
        >
          Post
        </Button>
      </Box>
    </Container>
  );
};

export default CreatePost;
