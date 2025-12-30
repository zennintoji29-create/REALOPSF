"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect authenticated users to their dashboard
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "teacher") {
        router.push("/teacher")
      } else {
        router.push("/student")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-border border-t-foreground rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <GraduationCap className="w-16 h-16 text-primary" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-6 text-balance">CollegeOps</h1>

          <p className="text-xl text-muted-foreground mb-12 text-pretty">
            A modern college management system for admins, teachers, and students. Streamline attendance, courses, and
            announcements all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/register")}>
              Create Account
            </Button>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Admin</h3>
              <p className="text-sm text-muted-foreground">Full system control with CRUD operations for all entities</p>
            </div>
            <div className="p-6 border border-border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Teacher</h3>
              <p className="text-sm text-muted-foreground">Manage courses, mark attendance, and create announcements</p>
            </div>
            <div className="p-6 border border-border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Student</h3>
              <p className="text-sm text-muted-foreground">View courses, attendance records, and announcements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
