import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

// Assuming supabase client is initialized

const useAuthStatus = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    // Function to fetch session on page load / get user if it existed
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session', error);
        setLoading(false);
      } else {
        setUser(data.session?.user || null);
        setLoading(false);
      }
    };

    getSession();

    // Listen for authentication state changes (e.g., sign in, sign out)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    
      if (event === 'SIGNED_IN' || event === 'SESSION_RESTORED') {
        setUser(session.user);

      } else if (event === 'SIGNED_OUT') {

        setUser(null);
      }
    });

    // Cleanup listener on component unmount
   
  }, []);

  return { loading, user};
};

export default useAuthStatus;

