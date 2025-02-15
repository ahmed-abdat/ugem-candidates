import { create } from "zustand";
import { userStorage } from "@/lib/storage";

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  image_url?: string; // Optional image URL for user avatar
}

interface UserStore {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: userStorage.getUser(),
  setUser: (user) => {
    if (user) {
      userStorage.setUser(user);
    } else {
      userStorage.clearUser();
    }
    set({ user });
  },
}));
