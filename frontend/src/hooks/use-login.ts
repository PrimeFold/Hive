import { useMutation } from "@tanstack/react-query";

import api from "@/lib/axios";
import { useAuth } from "@/context/auth-context";

export const useLogin = () => {
  const { login } = useAuth(); // Getting that login function we just made

  return useMutation({
    // 1. The actual API call
    mutationFn: async (credentials: any) => {
      const { data } = await api.post("/auth/login", credentials);
      return data; // This should contain { accessToken, user }
    },
    // 2. What happens when the backend says "OK"
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      // We will handle navigation here in a second!
    },
    // 3. What happens if the backend says "Nope"
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data?.message);
    }
  });
};