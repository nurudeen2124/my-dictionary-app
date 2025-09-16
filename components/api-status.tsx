"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, RefreshCw, Server } from "lucide-react"
import { checkAPIHealth } from "@/lib/dictionary-api"

export function APIStatus() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const healthy = await checkAPIHealth()
      setIsHealthy(healthy)
      setLastChecked(new Date())
    } catch (error) {
      setIsHealthy(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkHealth()
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    if (isHealthy === null) return "secondary"
    return isHealthy ? "default" : "destructive"
  }

  const getStatusIcon = () => {
    if (isChecking) return <RefreshCw className="h-4 w-4 animate-spin" />
    if (isHealthy === null) return <Server className="h-4 w-4" />
    return isHealthy ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (isChecking) return "Checking..."
    if (isHealthy === null) return "Unknown"
    return isHealthy ? "Online" : "Offline"
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Server className="h-5 w-5" />
          Python API Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant={getStatusColor()} className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>

        {lastChecked && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last checked:</span>
            <span className="text-sm">{lastChecked.toLocaleTimeString()}</span>
          </div>
        )}

        <Button
          onClick={checkHealth}
          disabled={isChecking}
          variant="outline"
          size="sm"
          className="w-full bg-transparent"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Status
            </>
          )}
        </Button>

        {isHealthy === false && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            <p className="font-medium">Python API Unavailable</p>
            <p className="text-xs mt-1">Make sure the Python server is running on localhost:8000</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
