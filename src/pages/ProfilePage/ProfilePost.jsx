import { Avatar, Box, Flex, GridItem, Image, Text, IconButton, Input, VStack, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import { MdDelete, MdOutlineMoreHoriz } from 'react-icons/md';
import { IoSend } from 'react-icons/io5';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Comments from '@/comps/Comment/Comments';
import PostFooter from '@/comps/FeedPosts/PostFooter';
import { supabase } from '@/utils/supabase';
import useAuthStatus from '@/hooks/useAuthStatus';
import { CommentLogo, NotificationsLogo, UnlikeLogo } from '@/assets/constants';
import { InputGroup } from '@/components/ui/input-group';
import { PiNumpadFill } from 'react-icons/pi';
import { Tooltip } from '@/components/ui/tooltip';
import { MdDeleteOutline } from "react-icons/md";
import useShowToast from '@/hooks/useShowToast';
import useNotif from '@/hooks/useNotif';
import useAuthStore from '@/store/authStore';
import { usePostsStore } from '@/store/postsStore';


const ProfilePost = ({ img ,postId,userId,post}) => {
  const [comment,setComment]=useState(null)
  const [loading,setLoading]=useState(false)
  const [usering,setUsering]=useState(null);
  const [refresh,setRefresh]=useState(0)
  const [likes,setLikes]=useState(0)
  const [commentText,setCommentText]=useState('')
  const [owner,setOwner]=useState(false);
  const {user,loading:loadingUser}=useAuthStatus()
  const {showToast}=useShowToast()
  const [likedPosts,setLikedPosts]=useState(null);
  const {sendNotification}=useNotif();
  const {notification,setNoti}=usePostsStore()
  
    // handling the likes
    const getLikesCount = async (postId) => {
      try {
        const { count, error } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postId);
    
        if (error) {
          console.error('Erreur lors de la récupération du nombre de likes:', error);
          return;
        }
        setLikes(count || 0); // Met à jour le nombre de likes
      } catch (error) {
        console.error('Erreur inconnue:', error);
      }
    };
    
    const getLikedPosts = async (userId) => {
      try {
        // Fetch profiles (or whatever relevant table you need) with user ID filtering
        const { data, error } = await supabase
          .from('likes') // Assuming you are querying the 'likes' table
          .select('*')
          .eq('user_id', userId); // Filter by user_id (adjust field names based on your schema)
    
        if (error) {
          console.error('Error fetching liked posts:', error);
          return error; // Return the error to handle it elsewhere if needed
        }
    
        setLikedPosts(data);
        
      } catch (error) {
        console.error('Error in getLikedPosts:', error); // Catch any unexpected errors
        return null; // Return null or handle it based on your needs
      }
    };
    
    const toggleLike = async ( postId,userId) => {
      try {
        // Check if the post is already liked
        const existingLike= likedPosts.find(item => item.post_id === postId);
       

        if (existingLike) {
          // Unlike (DELETE the record)
          const { error: deleteError } = await supabase
            .from("likes")
            .delete()
            .eq("user_id", userId)
            .eq("post_id", postId);
    
          if (deleteError) {
            console.error("Error unliking post:", deleteError);
          } else {
            
            setLikedPosts(prev => prev.filter(post => post.post_id !== postId)); // Update state
            await supabase.from('notifications').delete().eq('from_user_id', userId)

          }
        } else {
          // Like (INSERT new record)
          const { error: insertError } = await supabase
            .from("likes")
            .insert([{ user_id: userId, post_id: postId }]);
    
          if (insertError) {
            console.error("Error liking post:", insertError);
          } else {
            console.log(userId,user.id)
            await sendNotification(post.profiles.id, userId, "like", postId);
            setLikedPosts(prev => [...prev, { user_id: userId, post_id: postId }]); // Update state
            setNoti(true)
          }
        }
      } catch (error) {
        console.error("Error in toggleLike:", error);
      }
    };
    
    
    
    
    // Rafraîchissement automatique des likes et des posts aimés
    useEffect(() => {
      if (user) {
        getLikedPosts(user?.id);
      }
    }, [user,userId,postId]);
    
    useEffect(() => {
      getLikesCount(postId);
    }, [postId, likedPosts]);
    // end of handling likes

    //handle comments
    const handleAddComment = async () => {
      await addComment(postId, user?.id, commentText);
      setCommentText(""); // Clear input after posting
    };
    const addComment = async (postId, userId, content) => {
      if (!postId || !userId || !content.trim()) {
        console.error("Post ID, User ID, and content are required!");
        return;
      }
    
      const { data, error } = await  supabase
        .from("comments")
        .insert([{ post_id: postId, user_id: user?.id, title:content }])
        .select();
    
      if (error) {
        console.error("Error adding comment:", error.message);
      } else {
        setCommentText(null)
        setComment((prevComments) => [
          {post_id: postId, user_id: user?.id, title:content  , profiles: usering }, // Attach user profile info
          ...prevComments,
        ])
      }
  
    };
  
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const { data:cmnt, error } = await supabase
      .from("comments") // The table containing the comments
      .select("*, profiles(*)") // Select all columns from the comments table and the related profiles table
      .eq("post_id", postId) // Filter comments by post_id
      .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error.message);
      } else {
        if(loadingUser) return;
        if(!loadingUser){
          const { data, error } = await supabase
        .from("profiles") // The table containing the comments
        .select("*") // Select all columns from the comments table and the related profiles table
        .eq("id", user?.id).single(); // Filter comments by post_id
        setUsering(data)
        setComment(cmnt); // Set comments state
        }
        
      }
      setLoading(false);
    };

    fetchComments();
  }, [postId,userId,refresh,loadingUser]); 
  useEffect(() => {
     const subscription = supabase
          .channel("notifications")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
            setNoti()
          })
          .subscribe();
    
       
    const comments = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        (payload) => {
          //console.log("New Comment:", payload);
          setComment((prevComments) => [
            { ...payload.new, profiles: usering },
            ...prevComments,
          ]);
          console.log(user)
       
          setRefresh((prev) => prev + 1); // This triggers a re-render
        }
      )
      .subscribe();
  
    return () => {
      comments.unsubscribe();
    };
  }, [postId, userId]);
  //end of handling comment
   useEffect(()=>{
      if(loadingUser) return ;
      
      if(user?.id===userId){
        setOwner(true)
      }
    },[loadingUser])
  
  const deletePost = async ()=>{
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if(error) {
  
        showToast('error deleting','try another time','error')
        return
      }
      showToast('Post deleted','','success')
      window.location.reload(); // Reload the page after navigation
  
  
    }
    
    
    
    

  return (
    <DialogRoot placement={'center'} size={{ base: 'full', md: 'cover' }}>
     
      <DialogTrigger asChild>
        <GridItem
          cursor={'pointer'}
          borderRadius={4}
          overflow={'hidden'}
          border={'1px solid'}
          borderColor={'gray.300'}
          position={'relative'}
          aspectRatio={1 / 1}
        >
        
          <Flex
            opacity={0}
            _hover={{ opacity: 1 }}
            position={'absolute'}
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg={'blackAlpha.700'}
            transition={'all .3s ease'}
            zIndex={1}
            justifyContent={'center'}
            alignItems={'center'}
            gap={6}
          >
             
            <Flex alignItems={'center'} color={'white'}>
              <AiFillHeart size={20} />
              <Text fontWeight={'bold'} ml={2}>{likes}</Text>
            </Flex>
            
            <Flex alignItems={'center'} color={'white'}>
              <FaComment size={20} />
              <Text fontWeight={'bold'} ml={2}>{comment?.length}</Text>
            </Flex>
          </Flex>

          <Image src={img} alt='profile post' w={'100%'} h={'100%'} objectFit={'cover'} />
        </GridItem>
      </DialogTrigger>
    
      <DialogContent w={{ base: '100%', md: '70%' }} h={{ base: '100vh', md: '85vh' }} maxW={'900px'}>
        <Flex w={'full'} h={'full'} flexDir={{ base: 'column', md: 'row' }}>
          <Box flex={1.5} overflow={'hidden'} borderBottom={{ base: '1px solid', md: 'none' }} borderRight={{ md: '1px solid' }} borderColor={'gray.300'}>
            <Image objectFit={'cover'} src={img} alt='profile' w={'100%'} h={'100%'} />
          </Box>
          

          <Flex flex={1} flexDir={'column'}>
            <DialogHeader position={'relative'} p={4} borderBottom={'1px solid'} borderColor={'gray.300'}>
              <Flex alignItems={'center'} justifyContent={'space-between'} w={'full'}>
                <Flex alignItems={'center'} gap={2}>
                  <Avatar.Root size={'sm'}>
                     <Avatar.Image src={post?.profiles?.avatar} />
                 </Avatar.Root>
                  <Text fontWeight={'bold'} fontSize={14}>{post?.profiles?.username}</Text>
                </Flex>
                <IconButton icon={<MdDelete />} aria-label='Delete post' size='sm' variant='ghost' colorScheme='red' />
              </Flex>
              {owner && <Box onClick={deletePost} position={'absolute'} top={'25%'} right={'50px'} fontSize={20} >
                <Tooltip showArrow ml={1} positioning={{ placement: "right-end" }} openDelay={500}
                  closeDelay={100} display={{base:'block',md:'none'}}  content={'delete'}>
                   <MdDeleteOutline fontSize={'large'}/>
                </Tooltip>
               </Box>}
            </DialogHeader>
            
            <DialogBody flex={1}  overflowY={'scroll'} p={4}>
              {/* Sample comments section */}
             <VStack w={'full'} mt={5} alignItems={'center'} maxH={{base:'150px',md:'290px'}} overflowY={'auto'}>
                
                {!loading && comment && 
                comment?.map((comm,idx)=>{
                
                return <Comments key={idx}
                createdAt='1d ago'
                username={comm?.profiles?.username}
                profilePic={comm?.profiles?.avatar}
                text={comm.title} 
                userId={comm?.user_id}
                commentId={comm?.id}
                />
                })}

                 
                
            
             </VStack>
            </DialogBody>

            <DialogFooter w={'full'}  p={4} borderTop={'1px solid'} borderColor={'gray.300'}>

                <Box mb={10} w={'full'}>
                     <Flex alignItems={'center'} mb={2} mt={2} gap={4} w={'full'} pt={0}  >
                      <Box cursor={'pointer'} fontSize={18}  onClick={() => toggleLike(postId,user?.id)} >
                      {likedPosts !== null && (likedPosts.find(post => post.post_id === postId) ? <UnlikeLogo />:<NotificationsLogo /> )}

                      </Box>
                      <Box cursor={'pointer'} fontSize={18}>
                        <CommentLogo />
                      </Box>
                    </Flex>
                    <Text fontWeight={500} fontSize={'sm'}>
                      {post?.profiles?.username}
                      <Text as='span' mx={2} fontWeight={4}>
                        {post?.title}
                      </Text>
                    </Text>
                 
                    <Flex alignItems={'center'}
                    gap={4}
                    justifyContent={'space-between'}
                    w={'full'}
                    >
                      <InputGroup w={'full'} endElement={<Button bgColor={'transparent'} fontSize={14} color={'blue.500'} cursor={'pointer'} _hover={{color:'gray'}} onClick={handleAddComment}>Post</Button>}>
                        <Input variant={'flushed'}   value={commentText}   onChange={(e)=>setCommentText(e.target.value)}  placeholder="Add a comment" fontSize={14} />
                      </InputGroup>
                
                    </Flex>
                    
                    </Box>


            </DialogFooter>
          </Flex>
        </Flex>

        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default ProfilePost;
