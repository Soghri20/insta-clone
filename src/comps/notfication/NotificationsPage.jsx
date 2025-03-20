import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Button,
  Image,
  Flex,
  
} from "@chakra-ui/react";
import useAuthStatus from "@/hooks/useAuthStatus";
import { supabase } from "@/utils/supabase";
import useDate from "@/hooks/useDate";



const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const {user}=useAuthStatus();
  const {Dating}=useDate();
  const [userId,setUserId]=useState(null)


  useEffect(() => {
    const fetchNotifications = async (fetchPostImages) => {
      
      if(fetchPostImages){
        const { data: notifications, error } = await supabase
   .from("notifications")
  .select('*, posts(image)') // Get notifications and post images
  .eq("user_id", user?.id)
  .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching notifications:", error);
  } else {
    // Get all unique from_user_id values for fetching profiles in one request
    const userIds = notifications.map((notif) => notif.from_user_id);
  
    // Fetch profiles of all `from_user_id` in a single request
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);  // Use `in` to fetch multiple profiles at once
  
    if (profileError) {
      console.error("Error fetching profiles:", profileError);
    } else {
      // Combine notifications with profile data
      const combinedData = notifications.map((notif) => {
        // Find the profile corresponding to the `from_user_id` for each notification
        const profile = profiles.find((profile) => profile.id === notif.from_user_id);
  
        // Return the combined data (notification + profile)
        return {
          ...notif,
          profile: profile || {},  // Attach profile data (or an empty object if not found)
        };
      });
  
      // console.log("Combined Notifications and Profiles:", combinedData);
      // You can now set this data to your state or use it as needed
      setNotifications(combinedData);
    }
  }

      }else{
        const { data: notifications, error } = await supabase
         .from("notifications")
  .select('*') // Get notifications and post images
  .eq("user_id", user?.id)
  .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching notifications:", error);
  } else {
    // Get all unique from_user_id values for fetching profiles in one request
    const userIds = notifications.map((notif) => notif.from_user_id);
  
    // Fetch profiles of all `from_user_id` in a single request
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);  // Use `in` to fetch multiple profiles at once
  
    if (profileError) {
      console.error("Error fetching profiles:", profileError);
    } else {
      // Combine notifications with profile data
      const combinedData = notifications.map((notif) => {
        // Find the profile corresponding to the `from_user_id` for each notification
        const profile = profiles.find((profile) => profile.id === notif.from_user_id);
  
        // Return the combined data (notification + profile)
        return {
          ...notif,
          profile: profile || {},  // Attach profile data (or an empty object if not found)
        };
      });
  
      // console.log("Combined Notifications and Profiles:", combinedData);
      // You can now set this data to your state or use it as needed
      setNotifications(combinedData);
    }
  }

      }


    };

    if(user) {
      const checkIf = async () =>{
        const { data: notifications, error } = await supabase.from("notifications")
         .select('*') .eq("user_id", user?.id);
        if(error) throw error
     
        if (notifications && notifications.length > 0) {
          // Loop through each notification to handle types
          notifications.forEach((notif) => {
            if (notif.type === 'like') {
              // Fetch notifications with post images for 'like' type
              
              fetchNotifications(true);
            } else if (notif.type === 'follow') {
              // Fetch notifications without post images for 'follow' type
              fetchNotifications(false);
              console.log('Handling follow notification');
            }
          });
        } else {
          console.log('No notifications found');
        }
      }
      checkIf()
    }

    const subscription = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        setNotifications((prev) => [payload.new, ...prev]);
        console.log('hello world')
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  
  return (
    <Box maxW={{ base: "90%", md: "600px" }} mx="auto" p={{ base: 3, md: 5 }} mt={{base:5,md:10}} bg="white" boxShadow="md" borderRadius="lg">
  <Text fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" mb={3}>Notifications</Text>
  <VStack spacing={4} align="stretch">
    {notifications && notifications.map((notif) => {
      
     return <Box key={notif.id}>
        <HStack spacing={3} align="center" wrap="wrap">
          <Avatar.Root size={'md'}>
            <Avatar.Image src={notif.profile.avatar} />
          </Avatar.Root>
          <Box flex="1">
            <Flex justify="space-between" align="center">
                <Box>
                 <Text as={'span'}  fontWeight="bold">{notif.profile.username}</Text>
                 {notif.type === 'like' ? ' likes your post': ' just follow you'}
                 <Text fontWeight='thin' fontSize={12}>{Dating(notif.created_at)}</Text>

                </Box>
                {/* <Image  src={ notif.posts.image  }  alt="Profile Image"boxSize="40px" borderRadius="sm"  />} */}
            </Flex>
          </Box>
          {notif.follow && <Button size="xs" bgColor="blue.700" fontSize={10}>Follow</Button>}
          {notif.following && <Button size="xs" bgColor="white" variant="outline"  fontSize={10}>Following</Button>}
        </HStack>
      </Box>
})}
  </VStack>
</Box>

  );
};

export default NotificationsPage;