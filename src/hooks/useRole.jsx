import { useQuery } from "@tanstack/react-query"; // make sure react-query installed
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role = "user", isLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data?.role || "user";
    },
    enabled: !!user?.email, // wait until user is available
  });

  return { role, isLoading };
};

export default useRole;
