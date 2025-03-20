import useAuthStatus from "@/hooks/useAuthStatus";
import useNotif from "@/hooks/useNotif";
import { usePostsStore } from "@/store/postsStore";
import { supabase } from "@/utils/supabase";
import { Flex, Image, VStack, Text, Button, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ProfileHeader = ({ profile }) => {
  const { user } = useAuthStatus();
  const { posts } = usePostsStore();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [error, setError] = useState(null);
  const [follow, setFollow] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false); // Loading state for the button
  const {sendNotification}=useNotif();
  const {setNoti}=usePostsStore()
  useEffect(() => {
    if (!id) return;

    const fetchFollowCounts = async (userId) => {
      setLoading(true);
      setError(null);

      try {
        // Get follower count
        const { count: followers, error: followersError } = await supabase
          .from("followers")
          .select("*", { count: "exact", head: true })
          .eq("following_id", userId);

        if (followersError) throw followersError;

        // Get following count
        const { count: following, error: followingError } = await supabase
          .from("followers")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", userId);

        if (followingError) throw followingError;

        // Check if the current user follows the profile
        const { data, error } = await supabase
          .from("followers")
          .select("*")
          .eq("follower_id", user?.id)
          .eq("following_id", userId);

        if (error) throw error;

        setFollow(data.length > 0);
        setFollowersCount(followers || 0);
        setFollowingCount(following || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowCounts(id);
      const subscription = supabase
              .channel("notifications")
              .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
                setNoti()
              })
              .subscribe();
  }, [id, user?.id, follow]);

  const toggleFollow = async (followerId, followingId) => {
    setIsFollowingLoading(true); // Start button loading

    if (follow) {
      // If the user is already following, unfollow (DELETE)
      const { error: deleteError } = await supabase
        .from("followers")
        .delete()
        .eq("follower_id", followerId)
        .eq("following_id", followingId);

      if (deleteError) {
        console.error("Error unfollowing:", deleteError);
      } else {
        console.log("Unfollowed user!");
        setFollow(false); // Update follow state
         await supabase.from('notifications').delete().eq('from_user_id', followerId)
        
      }
    } else {
      // Otherwise, follow (INSERT)
      const { error: insertError } = await supabase
        .from("followers")
        .insert([{ follower_id: followerId, following_id: followingId }]);

      if (insertError) {
        console.error("Error following:", insertError);
      } else {
        console.log("Followed user!");
        setFollow(true); // Update follow state
        await sendNotification(followingId, followerId, "follow");
      }
    }

    setIsFollowingLoading(false); // Stop button loading
  };

 // if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <Flex direction={{ base: "column", sm: "row" }} py={10} px={4} maxW="800px">
      {/* Profile Image */}
      <Image
        boxSize={{ base: "100px", md: "150px" }}
        borderRadius="full"
        src={profile?.avatar}
        alt="Profile"
      />

      {/* Profile Info */}
      <VStack alignItems={{ base: "center", sm: "flex-start" }} flex={1} spacing={4} ml={{ sm: 6 }}>
        {/* Username and Edit Profile Button */}
        <Flex direction={{ base: "column", sm: "row" }} alignItems="center" w="full" gap={4}>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
            {profile?.username}
          </Text>
          {profile.id === user?.id ? (
            <Link to={`/edit-profile/${profile?.id}`}>
              <Button size={{ base: "sm", md: "md" }} _hover={{ bg: "gray.800", color: "white" }}>
                Edit Profile
              </Button>
            </Link>
          ) : (
            <Button
              onClick={() => toggleFollow(user?.id, id)}
              size={{ base: "sm", md: "md" }}
              bgColor={'blue.600'}
              _hover={{ bg: "gray.800", color: "white" }}
              loading={isFollowingLoading} loadingText="Loading" spinnerPlacement="start"
              // Show loading only on the button
            >
              {follow ? "Unfollow" : "Follow"}
            </Button>
          )}
        </Flex>

        {/* Stats */}
        <Flex gap={4} alignItems="center" justifyContent={{ base: "center", sm: "flex-start" }}>
          <Text>
            <Text as="span" fontWeight="bold" mr={1}>
              {posts && posts.length}
            </Text>
            Posts
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" mr={1}>
              {followersCount}
            </Text>
            Followers
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" mr={1}>
              {followingCount}
            </Text>
            Following
          </Text>
        </Flex>

        {/* Description */}
        <Box textAlign={{ base: "center", sm: "left" }}>
          <Text fontWeight="semibold">{profile?.fullname}</Text>
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
            {profile?.bio}
          </Text>
        </Box>
      </VStack>
    </Flex>
  );
};

export default ProfileHeader;
