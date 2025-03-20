import React from 'react'

const useDate = () => {
    const Dating = (isoDate) => {
        const now = new Date();
        const postDate = new Date(isoDate);
        const diffInSeconds = Math.floor((now - postDate) / 1000);
      
        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (postDate.toDateString() === yesterday.toDateString()) return "Yesterday";
      
        const options = { month: "short", day: "numeric" };
        if (postDate.getFullYear() !== now.getFullYear()) {
          options.year = "numeric";
        }
      
        return postDate.toLocaleDateString("en-US", options);
      };
  return {Dating}
}

export default useDate
