interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

const USER_STORAGE_KEY = "ugem_user_data";

export const userStorage = {
  getUser: (): UserData | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  setUser: (userData: UserData) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  },

  clearUser: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};
