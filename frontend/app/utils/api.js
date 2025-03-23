export const checkSession = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/sessions/current', {
      method: 'GET',
      credentials: 'include',
    });

    // If session check fails or no active session, return null
    if (!response.ok || response.status === 401) {
      console.log('No active session found');
      return null;
    }

    const sessionData = await response.json();
    
    // If no session data or user data, return null
    if (!sessionData?.user?.id) {
      console.log('Invalid session data');
      return null;
    }

    // Fetch user data only if session is valid
    const userResponse = await fetch(`http://localhost:3001/api/users/${sessionData.user.id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user data:', userResponse.status);
      return null;
    }

    const userData = await userResponse.json();
    console.log('User data fetched successfully:', userData); // Debugging log
    return userData; // Return only the user data without default values

  } catch (error) {
    console.error('Session check error:', error);
    return null; // Return null on any error
  }
};
