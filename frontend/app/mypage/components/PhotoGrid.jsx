'use client'
import React, { useState } from "react";
import styles from "../styles/PhotoGrid.module.css";

const PhotoGrid = ({ photos, profileId }) => {
  console.log('Profile ID:', profileId);
  console.log('All photos:', photos);
  
  // Filter photos to only show those belonging to the current profile
  const profilePhotos = photos.filter(photo => String(photo.user_id) === String(profileId));
  console.log('Filtered photos:', profilePhotos);
const [isFormVisible, setIsFormVisible] = useState(false); // State to manage form visibility
const [selectedPhoto, setSelectedPhoto] = useState(null); // State to store the selected photo
const [comments, setComments] = useState([]); // State to store comments
const [newComment, setNewComment] = useState(''); // State for new comment input


  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo); // Set the selected photo
    setIsFormVisible(true); // Show the form
  };

  return (
    <div className={styles.photoGrid}>
      {profilePhotos.map((photo, index) => (
        <div key={index} className={styles.photoItem} onClick={() => handlePhotoClick(photo)}>
          <img src={photo.url} alt={photo.description} className={styles.photoImage} />
        </div>
      ))}

      {isFormVisible && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.headerContent}>
                <h2>{selectedPhoto.description}</h2>
                <span className={styles.closeIcon} onClick={() => setIsFormVisible(false)}>&times;</span>
              </div>
            </div>
            <img src={selectedPhoto.url} alt={selectedPhoto.description} className={styles.photoImage} />
            <div className={styles.postDetails}>
              <div className={styles.nickname}>{selectedPhoto.nickname}</div>
              <div className={styles.likes}>{selectedPhoto.likes} лайк</div>
              <div className={styles.description}>{selectedPhoto.description}</div>
              
              {/* Comments Section */}
              <div className={styles.commentsSection}>
                {comments.map((comment, index) => (
                  <div key={index} className={styles.comment}>
                    <span className={styles.commentAuthor}>{comment.author}</span>: {comment.text}
                  </div>
                ))}
              </div>

              {/* Comment Form */}
              <form className={styles.commentForm} onSubmit={(e) => {
                e.preventDefault();
                if (newComment.trim()) {
                  setComments([...comments, { author: 'You', text: newComment }]);
                  setNewComment('');
                }
              }}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Написать комментарий..."
                  className={styles.commentInput}
                />
                <button type="submit" className={styles.commentButton}>Опубликовать</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
