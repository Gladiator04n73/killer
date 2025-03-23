'use client'
import { useState } from "react";
import React from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css"; 
import { logout } from "../../../utils/auth"; // Import the logout function
import { useAuth } from '../../../providers/AuthProvider'; // Import useAuth

export default function ProfileHeader() {
  const [postTitle, setPostTitle] = useState(''); // State for post title
  const [postBody, setPostContent] = useState(''); // State for post content
  const [image, setImage] = useState(null); // State for image
  const [show, setShow] = useState(null); // State for dropdown visibility
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const { user } = useAuth(); // Get user information from AuthProvider

  const handleLogout = async () => {
    await logout(); // Call the logout function from auth.js
    console.log("User logged out");
  };

  const onShowClick = (icon) => {
    console.log("Dropdown toggle clicked:", icon); // Added console log for debugging
    setShow(prevShow => (prevShow === icon ? null : icon === 'heart' ? 'heart' : icon === 'more' ? 'more' : ''));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData();
    formData.append('article[title]', postTitle);
    formData.append('article[body]', postBody); // Ensure body is sent under article key
    formData.append('article[photo]', image); // Ensure photo is sent under article key
    
      formData.append('user_id', user.id); // Include user_id in the FormData

    try {
      const response = await fetch('http://localhost:3001/api/articles', {
        method: 'POST',
        body: formData, // Use FormData to send the data
      });

      if (response.ok) {
        console.log("Post submitted successfully");
      } else {
        console.error("Error submitting post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <header className={styles.headerBg}>
      <div className={styles.headerContent}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b731b4d703b44d44bd8f1d62864f21ecdba94eb64f9d87a2b73c3c82c4094b9c?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
          className={styles.logo}
          alt="Instagram logo"
        />
        <div className={styles.searchContainer}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c1b15a3111a3172a4d5614e762633d0c41abfd83b44f5f36b0995944128c4ade?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
            className={styles.searchIcon}
            alt=""
          />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Поиск"
            aria-label="Search"
            value={searchQuery}
            onChange={async (e) => {
              const query = e.target.value;
              setSearchQuery(query);
              if (query.length > 2) {
                try {
                  const response = await fetch(`http://localhost:3001/api/users/search?q=${query}`);
                  if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                  }
                } catch (error) {
                  console.error('Search error:', error);
                }
              } else {
                setSearchResults([]);
              }
            }}
          />
          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map(user => (
                <Link 
                  key={user.id} 
                  href={`/profile/${user.id}`}
                  className={styles.searchResultItem}
                >
                  {user.nickname}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className={styles.navIconsContainer}>        
          <img
            loading="lazy"
            src='/home.png'
            className={styles.navIcons}
            alt="Navigation icons"
          />
          <img
            loading="lazy"
            src='/chat.png'
            className={styles.navIcons}
            alt="Navigation icons"
          />
          <img
            loading="lazy"
            src='/more.png'
            className={styles.navIcons}
            alt="Navigation icons"
            onClick={() => onShowClick('more')}
          />
          <img
            loading="lazy"
            src='/social.png'
            className={styles.navIcons}
            alt="Navigation icons"
          />
          <img
            loading="lazy"
            src='/heart.png'
            className={styles.navIcons}
            alt="Navigation icons"
            onClick={() => onShowClick('heart')}
          />
          {show === 'more' && (
            <div className={styles.formPost}>
              <form onSubmit={handlePostSubmit}>
                <input
                  type="text"
                  placeholder="Заголовок"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className={styles.formPostInput}
                  required
                />
                <textarea
                  placeholder="Описание"
                  value={postBody}
                  onChange={(e) => setPostContent(e.target.value)}
                  className={styles.formPostTextarea}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <button type="submit" className={styles.formPostButton}>OK</button>
              </form>
            </div>
          )}
          {show === 'heart' && (
            <div className={`${styles.dropdownMenu} ${show === 'heart' ? styles.active : ''}`}>
              <div className={styles.dropdownMenuContent}>
                <Link href="/profile" className={styles.dropdownLink}>Профиль</Link>
                <Link href="/editProfile" className={styles.dropdownLink}>Настройки</Link>
                <div className={styles.dropdownMenuDivider} />
                <a onClick={handleLogout} className={styles.dropdownLink}>Выйти</a> {/* Change Link to a */}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.divider} />
    </header>
  );
};
