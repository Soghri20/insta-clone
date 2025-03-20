import { title } from 'framer-motion/client'
import React from 'react'
import { Toaster,toaster } from "@/components/ui/toaster"


const useShowToast = () => {
    const showToast = (title,description,status)=>{
        toaster.create({
            title:title,
            description:description,
            type:status,
            isClosable:true,
            duration:3000
        })
    }
  return {showToast}
}

export default useShowToast
