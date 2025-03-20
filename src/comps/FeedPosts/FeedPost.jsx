import React from 'react'
import PostHeader from './PostHeader'
import { Box, Image } from '@chakra-ui/react'
import PostFooter from './PostFooter'

const FeedPost = ({posts}) => {
  return (
   <>
    {posts.map((post,index)=>{
   
     
      return   <div key={index}>
      <PostHeader profile={post.profiles} />
       <Box borderRadius={4} overflow={'hidden'}>
        <Image src={post.image} />
       </Box>
       <PostFooter post={post} />
    </div>
    })}

   </>
  )
}

export default FeedPost
