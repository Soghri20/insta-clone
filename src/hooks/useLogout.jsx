import React, { useState } from 'react'
import useShowToast from './useShowToast'
import useAuthStore from '@/store/authStore'
import { supabase } from '@/utils/supabase'
import { useNavigate } from 'react-router-dom'

const useLogout = () => {
   const [loading,setLoading]=useState(false)
   const {showToast}=useShowToast()   
   const navigate=useNavigate()
  const logout = async () =>{
      setLoading(true)
      try{
        let { error } = await supabase.auth.signOut()
        if(error) {
          showToast('error',error.message,'error')
          return
        }
        showToast('success','success','success')
        navigate('/welcome')

      }catch(error){
        showToast('error',error.message,'error')
      }
      setLoading(false)
      
    }

    
  return {logout,loading}
}

export default useLogout
