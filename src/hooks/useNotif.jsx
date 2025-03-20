import { supabase } from '@/utils/supabase';
import React from 'react'

const useNotif = () => {
    const sendNotification = async (user_id, from_user_id, type, post_id) => {
        
       await supabase.from("notifications").insert([{ user_id, from_user_id, type, post_id }]).select();
      
      };
  return {sendNotification}
   
}

export default useNotif
