import { CommentLogo, NotificationsLogo, UnlikeLogo } from '@/assets/constants';
import { InputGroup } from '@/components/ui/input-group';
import useAuthStatus from '@/hooks/useAuthStatus';
import { supabase } from '@/utils/supabase';
import { Avatar, Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BsSendArrowUp, BsSendDashFill } from 'react-icons/bs';
import { Dialog } from "@chakra-ui/react"
import useDate from '@/hooks/useDate';
import useNotif from '@/hooks/useNotif';
import { usePostsStore } from '@/store/postsStore';


const PostFooter = ({ post }) => {
  const [likes, setLikes] = useState(1000);
  const [commentText, setCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const { user } = useAuthStatus();
  const postId = post.id;
  const {Dating}=useDate();
  const {sendNotification}=useNotif();
  const {setNot}=usePostsStore()
  // Handle fetching the number of likes
  const getLikesCount = async (postId) => {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) {
        console.error('Error fetching like count:', error);
        return;
      }
      setLikes(count || 0);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  // Handle fetching liked posts for the logged-in user
  const getLikedPosts = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching liked posts:', error);
        return;
      }
      setLikedPosts(data);
    } catch (error) {
      console.error('Unexpected error in getLikedPosts:', error);
    }
  };

  // Handle toggling like/unlike
  const toggleLike = async (postId, userId) => {
    try {
      const existingLike = likedPosts.find(item => item.post_id === postId);

      if (existingLike) {
        // Unlike (delete the record)
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);

        if (deleteError) {
          console.error('Error unliking post:', deleteError);
        } else {
          setLikedPosts(prev => prev.filter(post => post.post_id !== postId)); // Update state
           await supabase.from('notifications').delete().eq('from_user_id', userId)
          

        }
      } else {
        // Like (insert a new record)
        const { data, error: insertError } = await supabase
          .from('likes')
          .insert([{ user_id: userId, post_id: postId }]);

        if (insertError) {
          console.error('Error liking post:', insertError);
        } else {
          setLikedPosts(prev => [...prev, { user_id: userId, post_id: postId }]); // Update state
          await sendNotification(post.profiles.id, userId, "like", postId);

        }
      }
    } catch (error) {
      console.error('Error in toggleLike:', error);
    }
  };

  // Fetch liked posts when the component mounts or user changes
  useEffect(() => {
    if (user) {
      getLikedPosts(user.id);
    }
  }, [user]);

  // Fetch the number of likes for the post when liked posts change
  useEffect(() => {
    if (postId) {
      getLikesCount(postId);
    }
      const subscription = supabase
              .channel("notifications")
              .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
                setNoti()
              })
              .subscribe();
  }, [postId, likedPosts]);

  // Fetch comments for the post
  const getComments = async (postId) => {
    try {
      const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(fullname, avatar)') // Assuming `profiles` table has `fullname` and `avatar`
      .eq('post_id', postId);

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }
      setComments(data);
    } catch (error) {
      console.error('Unexpected error in getComments:', error);
    }
  };

  // Handle adding a comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return; // Don't post empty comments
    await addComment(postId, user.id, commentText);
    setCommentText(''); // Clear input after posting
  };

  const addComment = async (postId, userId, content) => {
    if (!postId || !userId || !content.trim()) {
      console.error('Post ID, User ID, and content are required!');
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: userId, title: content }])
      .select();

    if (error) {
      console.error('Error adding comment:', error.message);
    } else {
      console.log('Comment added:', data);
      setCommentText(''); // Clear comment input
    }
  };

  return (
    <Box mb={10} w={'full'}>
      <Flex alignItems={'center'} mb={2} mt={2} gap={4} w={'full'} pt={0}>
        <Box onClick={() => toggleLike(post.id, user.id)} cursor={'pointer'} fontSize={18}>
          {likedPosts && likedPosts.find(like => like.post_id === postId) ? (
            <UnlikeLogo />
          ) : (
            <NotificationsLogo />
          )}
        </Box>
        <Box cursor={'pointer'} fontSize={18}>
          <CommentLogo />
        </Box>
      </Flex>
      <Text fontWeight={500} fontSize={'sm'}>
        {post.profiles.fullname}
        <Text as='span' mx={2} fontWeight={4}>
          {post.title}
        </Text>
      </Text>
      <Text fontSize={'sm'} color={'gray'}>
        {/* This will trigger the modal */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Text cursor={'pointer'} onClick={() => getComments(postId)}>View all comments</Text>
          </Dialog.Trigger>

          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.CloseTrigger asChild>
                <Button variant={'link'} color={'red'}>Close</Button>
              </Dialog.CloseTrigger>

              <Dialog.Header>
                <Dialog.Title>Comments</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                {comments.length === 0 ? (
                  <Text>No comments yet.</Text>
                ) : (
                  comments.map((comment) => {
                    console.log(comment)
                  return  <Box key={comment.id} mb={4}>
                  <Flex alignItems={'start'} gap={3}>
                  <Avatar.Root size={'sm'}>
                                        <Avatar.Image src={comment.profiles.avatar} />
                                    </Avatar.Root>
                    <Flex direction={'column'}>
                      <Flex alignItems={'center'} gap={1}>
                        <Text fontWeight={'semibold'} color={'gray.800'} fontSize={'sm'}>
                          {comment.profiles.fullname}
                        </Text>
                        <Text color={'gray.500'} fontSize={'sm'}>
                          {Dating(comment.created_at)}
                        </Text>
                      </Flex>
                      <Text fontSize={'sm'}>{comment.title}</Text>
                    </Flex>
                  </Flex>
                </Box>
})
                )}
              </Dialog.Body>

              <Dialog.Footer>
              <Input
                    variant={'flushed'}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment"
                    fontSize={14}
                  />
                  <Button
                    bgColor={'transparent'}
                    fontSize={14}
                    color={'blue.500'}
                    cursor={'pointer'}
                    _hover={{ color: 'gray' }}
                    onClick={handleAddComment}
                  >
                    Post
                  </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Text>

      <Flex alignItems={'center'} gap={4} justifyContent={'space-between'} w={'full'}>
        <InputGroup w={'full'} endElement={<Button bgColor={'transparent'} fontSize={14} color={'blue.500'} cursor={'pointer'} _hover={{ color: 'gray' }} onClick={handleAddComment}>Post</Button>}>
          <Input variant={'flushed'} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" fontSize={14} />
        </InputGroup>
      </Flex>
    </Box>
  );
};

export default PostFooter;
