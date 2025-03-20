import { create } from 'zustand';

export const usePostsStore =create((set)=>({
    posts:null,
    area:null,
    notification:false,
    setNoti:()=>set({notification:true}),
    RemNoti:()=>set({notification:false}),
    addAllPosts:(allPosts)=>set({posts:allPosts}),
    changeArea:(area)=>set({area:area})
}))