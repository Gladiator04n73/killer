'use client';

import React, { useState, useEffect } from "react";
import { checkSession } from "../utils/api"; // Import the checkSession function
import styles from "./styles/ChangePassword.module.css";
import { Header } from "./components/Header";
import { PasswordInput } from "./components/PasswordInput";
import { Sidebar } from "./components/Sidebar";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    'prev-password': '',
    'new-password': '',
    'confirm-password': ''
  });

  const [username, setUsername] = useState(''); // State for username

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await checkSession(); // Fetch user data using checkSession
      setUsername(userData.nickname); // Set the username from the fetched data
    };

    fetchUserData();
  }, []);

  const passwordInputs = [
    { label: "Предыдущий пароль", id: "prev-password" },
    { label: "Новый пароль", id: "new-password" },
    { label: "Подтвердите новый пароль", id: "confirm-password" },
  ];

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate passwords match
    if (formData['new-password'] !== formData['confirm-password']) {
      setError('Новый пароль и подтверждение должны совпадать');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration: {
            currentPassword: formData['prev-password'],
            newPassword: formData['new-password']
          }
        }),
        credentials: 'include'
      });

      // Check response content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось изменить пароль. Пожалуйста, попробуйте еще раз.');
      }

      setSuccess(true);
      setError(''); // Clear any previous error messages
      setFormData({
        'prev-password': '',
        'new-password': '', 
        'confirm-password': ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (id, value) => {
    console.log(`Input changed: ${id} = ${value}`); // Логирование изменения
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.sidebarColumn}>
            <Sidebar />
          </div>

          <section className={styles.mainSection}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar} />
              <span className={styles.username}>{username}</span>
            </div>

            <form className={styles.passwordForm} onSubmit={handleSubmit}>
              {passwordInputs.map((input) => (
                <PasswordInput
                  key={input.id}
                  label={input.label}
                  id={input.id}
                  value={formData[input.id]}
                  onChange={(value) => handleInputChange(input.id, value)}
                />
              ))}
              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>Пароль успешно изменен!</div>}
              <div className={styles.footerForm}>            
                <button type="submit" className={styles.submitButton}>
                  Изменить пароль
                </button>
                <a href="#" onClick={(e) => e.preventDefault()} className={styles.forgotPassword}>
                  Вы забыли свой пароль?
                </a>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
