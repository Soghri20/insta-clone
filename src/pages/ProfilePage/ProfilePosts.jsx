import { Box, Button, Grid, HStack, Image, Skeleton, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ProfilePost from './ProfilePost'

import useAuthStatus from '@/hooks/useAuthStatus'
import useShowToast from '@/hooks/useShowToast'
import { supabase } from '@/utils/supabase'
import { usePostsStore } from '@/store/postsStore'
import { useParams } from 'react-router-dom'
const ProfilePosts = ({profileId}) => {
    const [isLoading,setIsloading]=useState(false);
    const {user,loading}=useAuthStatus()
    const [posts,setPosts]=useState(null);
    const [likedPosts,setLikedPosts]=useState(null)
    const {showToast}=useShowToast();
    const {addAllPosts}=usePostsStore();
    const {area}= useParams()
  


    useEffect(()=>{
      const fetchPosts=async () =>{ 
       setIsloading(true)
        try{
          if(area==='posts'){
             const {data,error}=await supabase.from('posts').select("*, profiles(*)").eq('user_id',profileId)
             .order("created_at", { ascending: false }); 
             if(error) {
                showToast('error','error','error')
                return
             }
            setPosts(data);
            addAllPosts(data)
        }else if(area==='likes'){
          const { data: dd, error } = await supabase
  .from("likes")
  .select("*, posts(*, profiles:user_id(*))") // Fetch posts & post creator details
  .eq("user_id", profileId);
          console.log(dd)
      
             if(error) {
                showToast('error','error','error')
                return
             }
             const liking= dd.map(item => item.posts);
            setPosts(liking)
        }

        }catch(error){
          console.log(error)
        }finally{
          setIsloading(false)
        }
      }
      fetchPosts()
    },[loading,area])
  return (
    <Grid
    templateColumns={{
        sm:'repeat(1,fr)',
        md:'repeat(3,1fr)',
    }} gap={1} columnGap={1}>
        
        {isLoading && [1,2,3,4].map((_,idx)=>(
                <>
                 <VStack key={idx} alignItems={'flex-start'}>
                    <Skeleton w={'full'}>
                        <Box h='300px'>contents wrapped</Box>
                    </Skeleton>
                 </VStack>
                </>
              ))}
       

    {!isLoading &&  posts && posts.map((post,index)=>(
      <ProfilePost key={index} img={post?.image} post={post} postId={post?.id} userId={profileId} />
    ))
    }
 
    </Grid>
  )
}

export default ProfilePosts
