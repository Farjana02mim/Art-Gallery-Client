import { useEffect, useState } from "react"
import useAuth from "./useAuth"
import useAxiosSecure from "./useAxiosSecure"

const useRole = () => {
  const { user, loading } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [role, setRole] = useState(null)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    if (!loading && user?.email) {
      axiosSecure.get(`/users/role/${user.email}`)
        .then(res => {
          setRole(res.data.role) // admin | student | tutor
          setRoleLoading(false)
        })
        .catch(err => {
          console.error("Failed to fetch role:", err)
          setRole(null)
          setRoleLoading(false)
        })
    } else {
      setRole(null)
      setRoleLoading(false)
    }
  }, [user, loading, axiosSecure])

  return [role, roleLoading]
}

export default useRole
