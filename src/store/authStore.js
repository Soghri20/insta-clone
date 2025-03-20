import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    login: (user) => set({ user }), // Fixed missing curly braces
    logout: () => set({ user: null }),
    setUser: (user) => set({ user }) // Fixed missing curly braces
}));

export default useAuthStore;
