interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export const authStore = {
  getToken: (): string | null => localStorage.getItem('token'),
  
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    try {
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user || !user.id) {
        authStore.clearAuth();
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      authStore.clearAuth();
      return null;
    }
  },
  
  setAuth: (token: string, user: User): void => {
    if (!token || !user || !user.id) {
      console.error('Invalid auth data');
      return;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  clearAuth: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    const user = authStore.getUser();
    return !!(token && user && user.id);
  }
};