"use client"
import React, { useEffect, useState } from "react";
import { Post } from "./components/Post";
import { Sidebar } from "./components/Sidebar";
import styles from "./Feed.module.css";
import { Header } from "./components/Header";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [nickname, setNickname] = useState(""); // Add state for nickname

  useEffect(() => {
    const fetchUser = async () => {
      const userResponse = await fetch("http://localhost:3001/api/sessions/current", {
          method: "GET",
          credentials: 'include', // Include cookies for session authentication
      });
      console.log('User response status:', userResponse.status); // Log the response status
      if (!userResponse.ok) {
          console.error('Failed to fetch user data:', userResponse.statusText); // Log error if response is not ok
          return; // Exit if the fetch fails
      }
      const userData = await userResponse.json();
      console.log('User data:', userData); // Log user data for debugging
      console.log('User nickname:', userData.nickname); // Log nickname for debugging
      setNickname(userData.nickname); // Set the nickname from user data
      console.log('Fetched nickname:', userData.nickname); // Log the fetched nickname for debugging
    };

    const fetchPosts = async () => {
      console.log("Fetching posts..."); // Added for debugging
      const response = await fetch("http://localhost:3001/api/articles", {
        method: "GET",
      });
      const data = await response.json();
      console.log(data); // Output data for verification
      const postsWithFullUrls = data.map(post => ({
        ...post,
        photo_url: post.photo_url.startsWith('http') ? post.photo_url : `http://localhost:3001${post.photo_url}`
      })).reverse(); // Reverse the order of posts
      console.log(postsWithFullUrls.map(post => post.photo_url)); // Check photo URLs
      setPosts(postsWithFullUrls);
    };

    fetchPosts();
    fetchUser();
  }, []);

  return (
    <div className={styles.feed}>
      <Header nickname={nickname} />
      <main className={styles.mainContent}>
        <div className={styles.contentGrid}>
          <div className={styles.feedColumn}>
            {posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                title={post.title} // Updated to include title
                photo_url={post.photo_url} // Updated to include photo_url
                nickname={post.user.nickname} // Added to include user's nickname
                likes={post.likes} 
                description={post.body} // Updated to use post.body instead of post.comments.body
                commentCount={post.comments.length} // Updated to count comments correctly
                timeAgo={post.timeAgo}
                comments={post.comments} // Added to pass comments to Post component
              />
            ))}
          </div>
          <div className={styles.sidebarColumn}>
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
};
