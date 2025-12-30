"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "teacher" | "student"
  studentId?: string
  employeeId?: string
  department?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: "admin" | "teacher" | "student"
  studentId?: string
  employeeId?: string
  department?: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

useEffect(() => {
  const initAuth = async () => {
    const storedToken = localStorage.getItem("token")

    if (!storedToken) {
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })

      if (!res.ok) throw new Error("Invalid token")

      const userData = await res.json()

      setToken(storedToken)
      setUser(userData)

      localStorage.setItem("user", JSON.stringify(userData))
    } catch {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  initAuth()
}, [])

const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    // ✅ extract user properly
    const user = data.user

    setToken(data.token)
    setUser({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(user))

    // Redirect based on role
    if (user.role === "admin") {
      router.push("/admin")
    } else if (user.role === "teacher") {
      router.push("/teacher")
    } else {
      router.push("/student")
    }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}
const register = async (userData: RegisterData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Registration failed")
    }

    // ✅ BACKEND RETURNS FLAT USER
    const user = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    }

    setToken(data.token)
    setUser(user)

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(user))

    if (user.role === "admin") {
      router.push("/admin")
    } else if (user.role === "teacher") {
      router.push("/teacher")
    } else {
      router.push("/student")
    }
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}


  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
