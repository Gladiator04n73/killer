'use client'
import React from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import PhotoGrid from "./components/PhotoGrid";
import styles from "./styles/Profile.module.css";

export default function Profile({ params: paramsPromise }) {
  const params = React.use(paramsPromise);
  const [profileData, setProfileData] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  


  React.useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/articles?user_id=${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data.reverse());
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchProfileData();
    fetchPosts();
  }, [params.id]);

  if (!profileData) return <div>Loading...</div>;

  const profileStats = {
    posts: posts.length,
    followers: profileData.followers_count || 0,
    following: profileData.following_count || 0,
  };

  const photos = posts.map(post => {
    console.log('Post photo URL:', post.photo_url); // Log each photo URL
    return {
      url: post.photo_url.startsWith('http') ? post.photo_url : `http://localhost:3001${post.photo_url}`,
      description: post.title
    };
  });

  console.log('Photos array:', photos); // Log the complete photos array

  return (
    <div><ProfileHeader />
    <div className={styles.profile}>
      <ProfileInfo
        username={profileData.nickname}
        stats={profileStats}
        fullName={profileData.name}
      />
      <div className={styles.divider} />
      <div className={styles.tabIndicator} />
      <div className={styles.postsTab}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f43de0ce7b2f2dc66800f1a3dbd86bbc96011c229fa2de1c47beefae4b6a621?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
          alt=""
          className={styles.postsIcon}
        />
        <span>ПОСТЫ</span>
      </div>
      <div className={styles.gridContainer}>
        <PhotoGrid photos={photos} />
      </div>
    </div>
    </div>
  );
};
