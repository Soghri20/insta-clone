import { supabase } from '@/utils/supabase'
import React, { useState } from 'react'
import useShowToast from './useShowToast'
import useAuthStore from '@/store/authStore'
import useAuthStatus from './useAuthStatus'
import { useNavigate } from 'react-router-dom'

const useSignUpWithEmailAndPassword = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { user } = useAuthStatus()
    const { showToast } = useShowToast()
    const navigate = useNavigate()

    // Helper function to fetch the image from URL and upload to storage
    const uploadAvatarToStorage = async (imageUrl, userId) => {
        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const filePath = `avatars/${userId}.jpg`
            
            // Upload the image blob to Supabase Storage
            const { data, error } = await supabase.storage.from('avatars').upload(filePath, blob, {
                cacheControl: '3600',
                upsert: true // Replace if file already exists
            })
            
            if (error) {
                console.error("Error uploading avatar:", error.message)
                return
            }
            
            // Get the public URL of the uploaded image
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
            
            // Update user's profile with the new image URL
            await supabase.from('profiles').update({ avatar: publicUrl }).eq('id', userId)
            console.log("Avatar stored successfully!")
        } catch (error) {
            console.error("Error fetching and uploading avatar:", error.message)
        }
    }

    const signUp = async (input) => {
        console.log(loading)
        if (!input.email || !input.username) {
            return showToast('error', 'Please fill all the fields', 'error')
        }
        setLoading(true)
        try {
            if (user) {
                const userDoc = {
                    id: user?.id,
                    email: input.email,
                    username: input.username,
                    fullname: user?.identities[0]?.identity_data?.name,
                    followers: [],
                    following: [],
                    posts: [],
                    bio: input.bio || '', // Make bio optional
                    avatar: user?.identities[0]?.identity_data?.avatar_url // Save the avatar URL temporarily
                }

                const { data, error } = await supabase.from('profiles').insert(userDoc)

                if (error) {
                    showToast('error', error.message, 'error')
                    return
                }

                // Upload the avatar to storage if available
              
                uploadAvatarToStorage(user?.identities[0]?.identity_data?.avatar_url, user?.id)
                showToast('success', 'Sign-up complete', 'success')
                navigate('/home')
            }
        } catch (error) {
            showToast('error', 'Error during sign-up', 'error')
            return
        } finally {
            setLoading(false)
        }
    }

    return { signUp, loading, user }
}

export default useSignUpWithEmailAndPassword
