import React, { useEffect, useRef, useState } from 'react'
import FeedPost from './FeedPost'
import { Box, Container, Spinner } from '@chakra-ui/react'
import { HStack, Stack } from "@chakra-ui/react"
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@/components/ui/skeleton"
import useAuthStatus from '@/hooks/useAuthStatus'
import { supabase } from '@/utils/supabase'


const useBottomDetection = (callback) => {
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        callback(); // Appelle la fonction lorsque le bas est atteint
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback]);
}; 
const FeedPosts = () => {
  const [loading,setLoading]=useState(true);
  const {user}=useAuthStatus()
  const [posts,setPosts]=useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null); 
  const [lastFetched,setLastFetched]=useState(null);
  const [followedId,setFollowedId]=useState([]);
  const [loader,setLoader]=useState(true)



  const fetchFollowedPosts = async () => {
    setLoading(true)
    setLoader(true)
    // Step 1: Get the list of followed user IDs
    const { data: followedUsers, error: followsError } = await supabase
      .from("followers")
      .select("following_id") // Get only followed user IDs
      .eq("follower_id", user?.id);
  
    if (followsError) {
      console.error("Error fetching follows:", followsError);
      return;
    }
  
    // Extract the array of followed user IDs
    const followedIds = followedUsers.map(user => user.following_id);
    setFollowedId(followedIds)
  
    if (followedIds.length === 0) {
      console.log("User is not following anyone.");
      setPosts([]); // Set empty state
      return;
    }
  
    // Step 2: Fetch posts from followed users
    const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*, profiles:user_id(*), comments(*)") // Join profiles and comments
    .in("user_id", followedIds).order('created_at', { ascending: false }) // Change this depending on how you want to order the posts
    .limit(2); 
  
    if (postsError) {
      console.error("Error fetching followed posts:", postsError);
    } else {
      setPosts(posts);
      const last = posts.length-1
      setLastFetched(last)
      setLoading(false)
      setLoader(false)
    }
  };
  useEffect(()=>{
    if(user) fetchFollowedPosts()
   
  },[user?.id])





  const fetchingMore = async () =>{
    if (loading) return; // Prevent multiple requests
  
  try {
    const start = lastFetched + 1;
    const end = start + 8; // Fetch 3 more listings
    
    const { data, error } = await supabase
    .from("posts")
    .select("*, profiles:user_id(*), comments(*)") // Join profiles and comments
    .in("user_id", followedId).order('created_at', { ascending: false })
      .range(start, end); // Fetch next set of listings

    if (error) throw error;

    if (data && data.length > 0) {
      setPosts((prevListings) => [...prevListings, ...data]); // Append new data
      setLastFetched(end); // Update last fetched index
    }

  } catch (error) {
    console.error("Error fetching more listings:", error);
  } finally {
    setLoading(false);
  }

  }
  useBottomDetection(() => {
    fetchingMore()
  });




  return (
    <Container py={10} px={10} zIndex={2} >

       {loader && [1,2,4,5].map((i,index)=>(
        <div key={index} bgColor={'grey.300'}>
          <Stack gap="2" mb={'20px'} maxW="lg">
         <HStack width="full">
          <SkeletonCircle size="10" />
          <SkeletonText noOfLines={1} />
      </HStack>
      <Skeleton height="300px" />
    </Stack>
        </div>
       ))}
       {!loader &&  <FeedPost posts={posts}/>}
       {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <Spinner size="lg" />
        </Box>
      )}

      {/* Loader element at the bottom */}
      {hasMore && !loading && (
        <Box ref={loaderRef} h="50px" />
      )}

    </Container>
  )
}

export default FeedPosts
