import { toast } from "react-toastify";

export const handleApiError = (err, message = "Something went wrong") => {
  console.error(err);

  if (err?.response?.data?.message) {
    toast.error(err.response.data.message);
  } else {
    toast.error(message);
  }
};
