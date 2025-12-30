"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { StudentLayout } from "@/components/student-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"

interface AttendanceRecord {
  _id: string
  course: {
    courseCode: string
    courseName: string
  }
  date: string
  status: string
  remarks?: string
}

export default function StudentAttendancePage() {
  const { user, token } = useAuth()
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`${API_URL}/attendance/student/${user?._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setAttendance(data)
        }
      } catch (error) {
        console.error("Error fetching attendance:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (token && user?._id) {
      fetchAttendance()
    }
  }, [token, user?._id, API_URL])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "default"
      case "absent":
        return "destructive"
      case "late":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Attendance</h1>
            <p className="text-muted-foreground">View your attendance records</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-border border-t-foreground rounded-full animate-spin mx-auto" />
            </div>
          ) : attendance.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No attendance records yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {attendance.map((record) => (
                <Card key={record._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{record.course.courseName}</CardTitle>
                        <CardDescription>
                          {record.course.courseCode} • {format(new Date(record.date), "PPP")}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(record.status)}>{record.status}</Badge>
                    </div>
                  </CardHeader>
                  {record.remarks && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{record.remarks}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}
