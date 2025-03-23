import React, { useState } from "react";
import styles from "../styles/SuggestionItem.module.css";

const handleFollow = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/users/${userId}/follow`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to follow user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error following user:', error);
  }
};

const handleUnfollow = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/users/${userId}/unfollow`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to unfollow user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error unfollowing user:', error);
  }
};

export const SuggestionItem = ({ nickname, onClick, isFollowing = false, onFollowToggle = () => {}, userId }) => {
  const [following, setFollowing] = useState(isFollowing);

  const handleToggleFollow = async () => {
    try {
      if (following) {
        await handleUnfollow(userId);
      } else {
        await handleFollow(userId);
      }
      setFollowing(!following);
      onFollowToggle();
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  return (
    <div className={styles.suggestion}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}/>
        <div className={styles.details}>
          <div className={styles.username} onClick={onClick}>{nickname}</div>
          <div className={styles.subtitle}>Рекомендации</div>
        </div>
      </div>
      <button
        className={styles.followButton}
        onClick={handleToggleFollow}
      >
        {following ? 'Отписаться' : 'Подписаться'}
      </button>
    </div>
  );
};
