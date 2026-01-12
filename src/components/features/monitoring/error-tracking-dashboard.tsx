"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Bug, Clock, RefreshCw } from "lucide-react"

export function ErrorTrackingDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const mockErrors = [
    {
      id: "ERR-001",
      message: "Failed to fetch members",
      count: 15,
      level: "error" as const,
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      url: "/api/members",
    },
    {
      id: "ERR-002",
      message: "Database connection timeout",
      count: 8,
      level: "error" as const,
      lastSeen: new Date(Date.now() - 15 * 60 * 1000),
      url: "/api/donations",
    },
    {
      id: "ERR-003",
      message: "Invalid user session",
      count: 23,
      level: "warning" as const,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      url: "/api/auth/refresh",
    },
    {
      id: "ERR-004",
      message: "File upload size exceeded",
      count: 3,
      level: "warning" as const,
      lastSeen: new Date(Date.now() - 60 * 60 * 1000),
      url: "/api/documents",
    },
  ]

  const stats = {
    totalErrors: mockErrors.reduce((sum, e) => sum + e.count, 0),
    criticalErrors: mockErrors.filter(e => e.level === "error").length,
    warningErrors: mockErrors.filter(e => e.level === "warning").length,
    avgTimeToResolve: 45,
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Error Tracking Dashboard</h2>
          <p className="text-muted-foreground">Monitor and track application errors</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalErrors}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <Bug className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.criticalErrors}</div>
            <p className="text-xs text-muted-foreground">Unique errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.warningErrors}</div>
            <p className="text-xs text-muted-foreground">Unique errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolve Time</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTimeToResolve}m</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
          <CardDescription>Most frequent errors in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockErrors.map((error) => (
              <div
                key={error.id}
                className="flex items-start justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 rounded-full p-1 ${
                    error.level === "error" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"
                  }`}>
                    {error.level === "error" ? (
                      <Bug className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{error.message}</p>
                      <Badge variant={error.level === "error" ? "destructive" : "secondary"}>
                        {error.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{error.url}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">{error.count} occurrences</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(error.lastSeen)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
