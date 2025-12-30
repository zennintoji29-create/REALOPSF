"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { StudentLayout } from "@/components/student-layout"
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
  teacher: {
    name: string
    email: string
  }
  description?: string
}

export default function StudentCoursesPage() {
  const { user, token } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          // Filter courses where student is enrolled
          const enrolledCourses = data.filter((course: any) =>
            course.enrolledStudents?.some((student: any) => student._id === user?._id),
          )
          setCourses(enrolledCourses)
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
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">View your enrolled courses</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-border border-t-foreground rounded-full animate-spin mx-auto" />
            </div>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No courses enrolled yet</p>
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
                        <span className="text-muted-foreground">Teacher:</span>
                        <span className="font-medium">{course.teacher?.name || "TBA"}</span>
                      </div>
                    </div>
                    {course.description && <p className="mt-4 text-sm text-muted-foreground">{course.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
