import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "@/utils/api";

export const useUserSync = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) => {
      console.log("synced user", response.data.user);
    },
    onError: (error: any) => {
      console.error("sync user error", error);
    },
  });

  useEffect(() => {
    if (isSignedIn && !syncUserMutation.data) syncUserMutation.mutate();
  }, [isSignedIn]);
};
