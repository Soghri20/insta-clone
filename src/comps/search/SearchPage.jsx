import { supabase } from "@/utils/supabase";
import { Box, Input, Button, VStack, Text, Stack, Image, Grid, List, ListItem, Avatar } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const users = [
  { id: 1, name: "John Doe", username: "johndoe", avatar: "https://via.placeholder.com/40" },
  { id: 2, name: "Jane Smith", username: "janesmith", avatar: "https://via.placeholder.com/40" },
  { id: 3, name: "Alice Johnson", username: "alicej", avatar: "https://via.placeholder.com/40" },
  { id: 4, name: "Bob Brown", username: "bobb", avatar: "https://via.placeholder.com/40" }
];
const dummyResults = [
  { id: 1, name: "John Doe", username: "johndoe", avatar: "https://via.placeholder.com/40" },
  { id: 2, name: "Jane Smith", username: "janesmith", avatar: "https://via.placeholder.com/40" },
  { id: 3, name: "Alice Johnson", username: "alicej", avatar: "https://via.placeholder.com/40" },
  { id: 4, name: "Bob Brown", username: "bobb", avatar: "https://via.placeholder.com/40" }
];

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loadingPost,setLoadingPosts]=useState(true);
  const [posts,setPosts]=useState([]);

  const fetchPost = async () =>{
    try{
      const { data, error } = await supabase.rpc('get_random_posts');
      if(error) throw error;
      console.log(data)
      setPosts(data)
    }catch(error){
      console.log(error)
    }
    setLoadingPosts(false)
  }
  useEffect(()=>{ 
    fetchPost()
  },[]);

  setTimeout(()=>{
     fetchPost()
  },3600000)



  const handleSearch =async (event) => {
    const value = event.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setFilteredUsers([]);
    } else {
      const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%, fullname.ilike.%${query}%`);
      if(error){
        throw error
      }
      setFilteredUsers(data.filter((user) => user.fullname.toLowerCase().includes(value.toLowerCase()) || user.username.toLowerCase().includes(value.toLowerCase())));
    }
  };

  return (
    <Box maxW={{ base: "full", md: "1000px" }} mx="auto" p={{ base: 4, md: 6 }} mt={20} bg="white" boxShadow="md" borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">Search</Text>
        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        <VStack align="start" spacing={2} w="full" position="relative">
      <Input 
        placeholder="Search..." 
        value={query} 
        onChange={handleSearch} 
        width="300px" 
        borderRadius="md" 
        bg="gray.100"
      />
      {query && filteredUsers.length > 0 && (
        <Box w="full" bg="white" boxShadow="md" borderRadius="md" p={2} position="absolute" top="40px" zIndex={10}>
          <Box spacing={2}>
            {filteredUsers.map((user) => (
              <Link to={`/profile/${user.id}/posts`}>
              <Box key={user.id} p={2} display="flex" alignItems="center" cursor="pointer" _hover={{ bg: "gray.200" }}>
                  <Avatar.Root size={'md'}>     
                    <Avatar.Image src={user?.avatar} />
                  </Avatar.Root>
                <VStack align="start" ml={2} >
                  <Text fontWeight="bold" mb={'-10px'} >{user.fullname}</Text>
                  <Text fontSize="sm"  color="gray.500">@{user.username}</Text>
                </VStack>
              </Box>
              </Link>
            ))}
          </Box>
        </Box>
      )}
    </VStack>
          <Button
            colorScheme="blue"
            onClick={handleSearch}
            size="md"
            width={{ base: "full", md: "auto" }}
          >
            Search
          </Button>
        </Stack>

        {/* Results Section */}
        {!loadingPost && posts.length > 0 ? (
          <Grid 
            mt={4}
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
            gap={0}
          >
            {posts.map((result) => (
              <Link to={`/profile/${result.user_id}/posts`}>
              <Box key={result.id} p={1} borderRadius="md" >
                <Image src={result.image} mx='auto' alt={result.name}  boxSize="320px" objectFit="cover" />
                <Text mt={3} fontWeight="bold">{result.name}</Text>
                {/* <Text fontSize="sm" color="gray.500">{result.description}</Text> */}
              </Box>
              </Link>
            ))}
          </Grid>
        ) : (
          <Text>No results found</Text>
        )}
      </VStack>
    </Box>
  );
};

export default SearchPage;
