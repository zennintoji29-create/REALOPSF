"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { TeacherLayout } from "@/components/teacher-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { formatDistance } from "date-fns"

interface Announcement {
  _id: string
  title: string
  content: string
  targetAudience: string
  priority: string
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
}

export default function TeacherAnnouncementsPage() {
  const { token } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${API_URL}/announcements`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setAnnouncements(data)
        }
      } catch (error) {
        console.error("Error fetching announcements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchAnnouncements()
    }
  }, [token, API_URL])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <TeacherLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Announcements</h1>
            <p className="text-muted-foreground">View and create announcements</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-border border-t-foreground rounded-full animate-spin mx-auto" />
            </div>
          ) : announcements.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No announcements yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription>
                          By {announcement.createdBy.name} •{" "}
                          {formatDistance(new Date(announcement.createdAt), new Date(), { addSuffix: true })}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                        <Badge variant="outline">{announcement.targetAudience}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{announcement.content}</p>
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
