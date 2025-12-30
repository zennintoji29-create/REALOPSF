"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { TeacherLayout } from "@/components/teacher-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

interface Course {
  _id: string
  courseCode: string
  courseName: string
  department: string
  credits: number
  semester: number
  enrolledStudents: Array<{ _id: string; name: string; email: string }>
  description?: string
}

export default function TeacherCoursesPage() {
  const { user, token } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
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
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">View and manage your assigned courses</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-border border-t-foreground rounded-full animate-spin mx-auto" />
            </div>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No courses assigned yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.courseName}</CardTitle>
                        <CardDescription>{course.courseCode}</CardDescription>
                      </div>
                      <Badge variant="secondary">{course.credits} Credits</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium">{course.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Semester:</span>
                        <span className="font-medium">{course.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{course.enrolledStudents?.length || 0}</span>
                      </div>
                    </div>
                    {course.description && <p className="mt-4 text-sm text-muted-foreground">{course.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TeacherLayout>
    </ProtectedRoute>
  )
}
