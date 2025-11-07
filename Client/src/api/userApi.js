import axiosInstance from "@/utils/axios";
import {jwtDecode} from 'jwt-decode'

export const fetchAllUsers = async (search = "") => {
  const res = await axiosInstance.get(
    `/user/find-user?search=${encodeURIComponent(search)}`
  );
  return res.data.users;
};

export const fetchUserDetails = async (userId) => {
  try {
    // Decode from token if userId is not explicitly passed
    if (!userId) {
      const tokenString = localStorage.getItem("token");
      if (!tokenString) throw new Error("No token found in localStorage");

      const decoded = jwtDecode(tokenString);
      userId = decoded.id;
    }

    const response = await axiosInstance.get(`/user/details?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
