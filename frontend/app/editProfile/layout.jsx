import React from 'react';
export const metadata = {
  title: 'Редактировать профиль',
};
const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      
      <main>
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
