'use client'
import React from "react";
import { useRouter } from 'next/navigation';
import { SuggestionItem } from "./SuggestionItem";
import styles from "../styles/Sidebar.module.css";

export const Sidebar = () => {
  const [suggestions, setSuggestions] = React.useState([]);
  const [currentUserId, setCurrentUserId] = React.useState('');

  React.useEffect(() => {
    const fetchSuggestions = async (currentUserId) => {
      try {
        const response = await fetch('http://localhost:3001/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Fetched users:", data); // Log fetched users
        const filteredSuggestions = data ? data.filter(user => {
          if (user.id === currentUserId) {
            console.log('Excluding current user from suggestions:', user);
            return false;
          }
          return true;
        }) : [];
        console.log("Filtered suggestions (excluding current user):", filteredSuggestions);
        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const fetchCurrentUser = async () => {
      console.log("Fetching current user..."); // Debug log
      try {
        const response = await fetch('http://localhost:3001/api/sessions/current', {
          credentials: 'include' // Include cookies for authentication
        });
        
        if (response.status === 401) {
          console.warn('User not authenticated, redirecting to login');
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Current User Data:", data); // Log the current user data
        
        if (data && data.user && data.user.id) {
          setCurrentUserId(data.user.id); // Store the current user's ID from the user object
          // Fetch suggestions immediately after setting currentUserId
          await fetchSuggestions(data.user.id);
        } else {
          console.error('Current user data is invalid:', data);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const fetchData = async () => {
      await fetchCurrentUser();
    };

    fetchData();
  }, []);

  const router = useRouter();

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.userProfile}>
          <div className={styles.avatar} onClick={() => router.push(`/profile/${currentUserId}`)} />
        </div>
        <div className={styles.suggestionsHeader}>
          <div className={styles.suggestionsTitle}>Предложения для вас</div>
          <div className={styles.seeAll}>Смотреть все</div>
        </div>
        <div className={styles.suggestionsList}>
          {suggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.nickname}
              nickname={suggestion.nickname}
              userId={suggestion.id} // Assuming the user ID is available in the suggestion object
              onClick={() => {
                console.log(`Navigating to profile of user ID: ${suggestion.id}`); // Log the user ID being used
                router.push(`/profile/${suggestion.id}`); // Use userId for navigation
              }}
            />
          ))}
        </div>
        <div className={styles.footer}>
          Информация · Помощь · Заключенный · API · Работа · Конфиденциальность · Условия ·
          Местоположения · Популярные аккаунты · Хэштеги · Язык
        </div>
        <div className={styles.copyright}>© ИНСТАГРАМ 2025</div>
      </div>
    </>
  );
};
