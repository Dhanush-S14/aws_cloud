import { create } from "zustand";
import axiosInstance from "@/utils/axios";

export const useUserStore = create((set, get) => ({
  user: null,

  setUser: (user) => {
    console.log("user is: ",user),
    set({ user })},

  clearUser: () => set({ user: null }),

  isProfileComplete: () => {
    const user = get().user;
    if (!user) return false;

    const requiredFields = [
      "FirstName",
      "LastName",
      "Email",
      "Bio",
      "Gender",
      "University",
      "Country",
      "FieldOfStudy",
      "GraduationYear",
    ];

    return requiredFields.every(
      (field) =>
        user[field] !== null && user[field] !== undefined && user[field] !== ""
    );
  },

  isBasicInfoComplete: () => {
    const user = get().user;
    if (!user) return false;
    const basicFields = ["FirstName", "LastName", "Country", "Bio", "Gender"];
    return basicFields.every((f) => user[f]);
  },

  isEduSkillsComplete: () => {
    const user = get().user;
    if (!user) return false;
    const eduFields = ["University", "FieldOfStudy", "GraduationYear"];
    return eduFields.every((f) => user[f]);
  },
}));

// eslint-disable-next-line react-refresh/only-export-components
export const fetchUserStats = async (userId) => {
  try {
    const response = await axiosInstance.get(`/friends/${userId}/stats`);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user stats:",
      error.response?.data || error.message
    );
    throw error;
  }
};
