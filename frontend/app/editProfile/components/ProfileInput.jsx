'use client'
import React, { useEffect, useState } from "react";
import { useAuth } from '../../providers/AuthProvider';
import styles from "../styles/ProfileInput.module.css";


export function ProfileInput() {
  const { user } = useAuth(); // Get user from AuthContext
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    nickname: '',
    email: 'Email не указан',
    description: 'Введите описание',
    gender: 'Мужской',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('User object:', user); // Log the user object for debugging
    const fetchUserData = async () => {
      const userId = user ? user.id : ''; // Use user ID from AuthContext
      console.log('User ID:', userId); // Log the user ID for debugging
      if (userId) {
        try {
          const response = await fetch(`http://localhost:3001/api/users/${userId}`);
          const data = await response.json();
          console.log('Received user profile data:', data); // Log the user profile data for debugging
          if (data) {
            setUserData({
              id: data.id,
              nickname: data.nickname || '',
              email: data.email || '',
              description: data.description || '',
              gender: data.gender || '',
              name: data.name || '',
            });
            setError(null);
          } else {
            console.warn('No user profile data received');
            setError('Не удалось загрузить данные пользователя. Пожалуйста, войдите в систему.');
          }
        } catch (err) {
          console.error('Ошибка при загрузке данных:', err);
          setError('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        }
      }
    };
    fetchUserData();
  }, [user]); // Re-run effect when user changes

  const handleSubmit = async (e) => {
    const userId = userData.id; // Получить идентификатор пользователя
    e.preventDefault();
    const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userData }), // Обернуть userData в объект user
    });

    if (response.ok) {
      const updatedUserData = await response.json();
      setUserData(updatedUserData);
      setError(null);
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Ошибка при обновлении данных.');
    }
  };
  const handleDeactivate = async () => {
    const userId = userData.id; // Get user ID
    const response = await fetch(`http://localhost:3001/api/users/${userId}/deactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      // Handle successful deactivation (e.g., redirect or show a message)
      console.log('Account deactivated successfully');
    } else {
      // Handle error
      console.error('Error deactivating account');
    }
  };
  return (
    <div>
                  <section className={styles.profileSection}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarContainer} />
                <div className={styles.profileInfo}>
                  <h1 className={styles.username}>{userData.nickname || ''}</h1>
                  <button className={styles.changePhotoButton}>
                    Изменить фото профиля
                  </button>
                </div>
              </div>
              <div className={styles.profileForm}>
              <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <label className={styles.formLabel}>Имя</label>
        <input 
        className={styles.formInput} 
        value={userData.name || 'Имя пользователя недоступно'} 
        onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
        <div className={styles.helpText}>
        Чтобы помочь людям найти вашу учетную запись, используйте имя, по которому вас знают
люди, будь то ваше полное имя, псевдоним или название компании.
Вы можете изменить свое имя только дважды в течение 14-дневного периода.
        </div>
        <label className={styles.formLabel}>Имя пользователя</label>
        <input 
          className={styles.formInput} 
          value={userData.nickname} 
          placeholder={error ? 'Ошибка загрузки имени' : 'Имя пользователя'}
          onChange={(e) => setUserData({ ...userData, nickname: e.target.value })} 
        />
        <div className={styles.helpText}>
        В большинстве случаев вы сможете изменить свое имя пользователя обратно на
        johndoe еще на 14 дней. Дополнительная информация
        </div>
        <label className={styles.formLabel}>Описание</label>
        <textarea 
          className={styles.descriptionTextarea} 
          value={userData.description} 
          onChange={(e) => setUserData({ ...userData, description: e.target.value })} 
        />
        <div className={styles.sectionTitle}>Персональная информация</div>
        <div className={styles.helpText}>Предоставьте свою личную информацию,
даже если учетная запись используется для бизнеса, домашнего животного и т. д.
Эта информация не будет храниться в вашем общедоступном профиле.
        </div>
        <label className={styles.formLabel}>Email</label>
        <input 
          className={styles.formInput} 
          value={userData.email} 
          placeholder="Введите email"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })} 
        />
        <label className={styles.formLabel}>Пол</label>
        <input className={styles.formInput} 
          value={userData.gender} 
          placeholder="Введите ваш пол"
          onChange={(e) => setUserData({ ...userData, gender: e.target.value })} 
        />


      </form>
              </div>
              <div className={styles.actionButtons}>
              <button type="submit" className={styles.submitButton}>
        Отправить
        </button>
        <button type="button" className={styles.deactivateButton} onClick={handleDeactivate}>
        Временно деактивировать мой аккаунт
        </button>
      </div>
            </section>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}
