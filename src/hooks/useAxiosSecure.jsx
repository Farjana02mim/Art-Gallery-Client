import axios from "axios"
import { useAuth } from "./useAuth"  // ✅ named import

const useAxiosSecure = () => {
  const { logOut } = useAuth() || {} // optional chaining দিয়ে safe

  const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
  })

  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token")
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    },
    (error) => Promise.reject(error)
  )

  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      if ((error.response?.status === 401 || error.response?.status === 403) && logOut) {
        await logOut()
        localStorage.removeItem("access-token")
      }
      return Promise.reject(error)
    }
  )

  return axiosSecure
}

export default useAxiosSecure
