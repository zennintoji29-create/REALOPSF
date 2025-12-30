"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { StudentLayout } from "@/components/student-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ClipboardCheck, Bell } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function StudentDashboard() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({
    totalCourses: 0,
    attendanceRecords: 0,
    totalAnnouncements: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesRes, attendanceRes, announcementsRes] = await Promise.all([
          fetch(`${API_URL}/courses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/attendance/student/${user?._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/announcements`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const courses = await coursesRes.json()
        const attendance = await attendanceRes.json()
        const announcements = await announcementsRes.json()

        // Filter courses where student is enrolled
        const enrolledCourses = Array.isArray(courses)
          ? courses.filter((course: any) => course.enrolledStudents?.some((student: any) => student._id === user?._id))
          : []

        setStats({
          totalCourses: enrolledCourses.length,
          attendanceRecords: Array.isArray(attendance) ? attendance.length : 0,
          totalAnnouncements: Array.isArray(announcements) ? announcements.length : 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (token && user?._id) {
      fetchStats()
    }
  }, [token, user?._id, API_URL])

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-border border-t-foreground rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">Active courses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.attendanceRecords}</div>
                  <p className="text-xs text-muted-foreground">Total records</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAnnouncements}</div>
                  <p className="text-xs text-muted-foreground">Unread announcements</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
