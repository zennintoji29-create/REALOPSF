"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, ClipboardCheck, Bell, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface StudentLayoutProps {
  children: React.ReactNode
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/student", icon: GraduationCap },
    { name: "My Courses", href: "/student/courses", icon: BookOpen },
    { name: "Attendance", href: "/student/attendance", icon: ClipboardCheck },
    { name: "Announcements", href: "/student/announcements", icon: Bell },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8" />
              <div>
                <h2 className="font-bold text-lg">CollegeOps</h2>
                <p className="text-xs text-muted-foreground">Student Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start" size="sm">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="mb-3 px-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
