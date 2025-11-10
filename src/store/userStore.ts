import { create } from "zustand";


type User = {
    fullName: string;
    email: string;
    avatar: string;
};

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
