"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { TeacherLayout } from "@/components/teacher-layout"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function TeacherAttendancePage() {
  const { user, token } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses/teacher/${user?._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setCourses(data)
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (token && user?._id) {
      fetchCourses()
    }
  }, [token, user?._id, API_URL])

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <TeacherLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-muted-foreground">Mark and manage student attendance</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-border border-t-foreground rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Attendance marking interface - Implementation in progress</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {courses.length} course{courses.length !== 1 ? "s" : ""} available for attendance
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </TeacherLayout>
    </ProtectedRoute>
  )
}
