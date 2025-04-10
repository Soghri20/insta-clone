import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckProfile = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserProfile = async () => {
      setLoading(true);

      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/welcome');  // Redirect to login if no user is found
        return;
      }

      // Check if the user's profile exists in the "profiles" table
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (data) {
        navigate('/home');  // If the user already completed signup, redirect to home
      }

      setLoading(false);
    };

    checkUserProfile();
  }, [navigate]);

  if (loading) return <p>Loading...</p>; // Show loading state

  return children;

};

export default CheckProfile;
