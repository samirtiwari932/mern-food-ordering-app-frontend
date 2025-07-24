import type { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyUserRequest = async (): Promise<User> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching user data`);
    }
    return response.json();
  };

  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMyUserRequest,
    refetchOnWindowFocus: false,
  });

  if (error) {
    toast.error(error.toString());
  }
  return { currentUser, isLoading };
};
type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const createMyUserRequest = async (user: CreateUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(user),
    });
    console.log("Response from createMyUserRequest:", response);
    if (!response.ok) {
      throw new Error(`Error creating user:`);
    }
  };

  const {
    mutateAsync: createUser,
    isError,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: createMyUserRequest,
  });

  return { createUser, isError, isSuccess, isPending };
};

type UpdateUserRequest = {
  name: string;
  addressLine1: string;
  country: string;
  city: string;
};
export const useUpdateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const updateMyUserRequest = async (formData: UpdateUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`failed to update user`);
    }
    return response.json();
  };
  const {
    mutateAsync: updateUser,
    isError,
    isPending,
    error,
    reset,
    isSuccess,
  } = useMutation({
    mutationFn: updateMyUserRequest,
  });
  if (isSuccess) {
    toast.success("User updated successfully");
  }
  if (error) {
    toast.error(error.toString());
    reset(); // Reset the error state after showing the toast
  }
  return { updateUser, isError, isSuccess, isPending };
};
