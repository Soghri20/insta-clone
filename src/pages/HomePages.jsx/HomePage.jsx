import FeedPosts from '@/comps/FeedPosts/FeedPosts'
import SuggestedUsers from '@/comps/SuggestedUsers/SuggestedUsers'
import { Box, Container, Flex } from '@chakra-ui/react'
import React from 'react'

const HomePage = () => {
  return (
    <Container maxW={'container.lg'} zIndex={2}>
      <Flex gap={20}>
        <Box flex={3} py={20}>
          <FeedPosts />
        </Box>
        <Box
          flex={2}
          py={20}
          display={{ base: 'none', md: 'block' }}
          position={{ md: 'sticky' }}
          top={0}
          h="calc(100vh - 80px)" // Adjust the height to stay fixed
          overflowY="auto" // Allow scrolling inside the box if needed
        >
          <SuggestedUsers />
        </Box>
      </Flex>
    </Container>

  )
}

export default HomePage
