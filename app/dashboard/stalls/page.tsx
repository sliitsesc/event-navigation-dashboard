"use client"

import { useState, useEffect, useCallback } from "react"
import type { Zone, Stall } from "@/types"
import { api } from "@/lib/api"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StallForm } from "@/components/stall-form"
import { ProtectedRoute } from "@/components/protected-route"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Store, MapPin } from "lucide-react"

export default function StallsPage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [stalls, setStalls] = useState<Stall[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingStall, setEditingStall] = useState<Stall | undefined>()
  const [error, setError] = useState("")

  const loadStalls = useCallback(async (zoneId: number) => {
    try {
      setError("") // Clear any previous errors
      const response = await api.getStalls(zoneId)
      if (response.status === "successful") {
        setStalls(response.results)
      }
    } catch (err) {
      // Handle the specific case where no stalls are found for a zone
      const errorMessage = err instanceof Error ? err.message : String(err)
      if (errorMessage?.includes("Stall not found")) {
        setStalls([]) // Set empty stalls array to show the empty state
      } else {
        setError("Failed to load stalls")
      }
    }
  }, [])

  const loadZones = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.getZones()
      if (response.status === "successful") {
        setZones(response.results)
        if (response.results.length > 0 && !selectedZone) {
          const firstZone = response.results[0]
          setSelectedZone(firstZone)
          loadStalls(firstZone.id)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load zones"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [selectedZone, loadStalls])

  useEffect(() => {
    loadZones()
  }, [loadZones])

  const handleZoneChange = (zoneId: string) => {
    const zone = zones.find((z) => z.id === Number.parseInt(zoneId))
    if (zone) {
      setSelectedZone(zone)
      loadStalls(zone.id)
    }
  }

  const handleEdit = (stall: Stall) => {
    setEditingStall(stall)
    setShowDialog(true)
  }

  const handleDelete = async (stall: Stall) => {
    if (window.confirm(`Are you sure you want to delete "${stall.name}"?`)) {
      try {
        setError("") // Clear any previous errors
        await api.deleteStall(stall.id)
        if (selectedZone) {
          await loadStalls(selectedZone.id)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete stall"
        setError(errorMessage)
      }
    }
  }

  const handleSuccess = () => {
    setShowDialog(false)
    setEditingStall(undefined)
    if (selectedZone) {
      loadStalls(selectedZone.id)
    }
  }

  const handleCancel = () => {
    setShowDialog(false)
    setEditingStall(undefined)
  }

  if (loading) {
    return (
      <ProtectedRoute fallback={<LoginForm />}>
        <DashboardLayout>
          <div className="text-center py-8">Loading stalls...</div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (zones.length === 0) {
    return (
      <ProtectedRoute fallback={<LoginForm />}>
        <DashboardLayout>
          <div className="text-center py-12">
            <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No zones found</h3>
            <p className="text-muted-foreground">Create zones first to manage stalls</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute fallback={<LoginForm />}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Stall Management</h1>
              <p className="text-muted-foreground">Create and manage exhibition stalls</p>
            </div>
            <Button onClick={() => setShowDialog(true)} disabled={!selectedZone}>
              <Plus className="mr-2 h-4 w-4" />
              Create Stall
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Select Zone:</label>
            <Select value={selectedZone?.id.toString() || ""} onValueChange={handleZoneChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a zone" />
              </SelectTrigger>
              <SelectContent>
                {zones.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.colorCode }} />
                      <span>{zone.zoneName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stalls.map((stall) => (
              <Card key={stall.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{stall.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      Floor {stall.floorNumber}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{stall.name}</CardTitle>
                  <CardDescription>
                    <strong>Organizer:</strong> {stall.organizer}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {stall.location}
                    </div>
                    {stall.description && <p className="text-muted-foreground line-clamp-2">{stall.description}</p>}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(stall)} className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(stall)}
                      className="flex-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedZone && stalls.length === 0 && (
            <div className="text-center py-12">
              <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No stalls found in {selectedZone.zoneName}</h3>
              <p className="text-muted-foreground mb-4">Create your first stall for this zone</p>
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Stall
              </Button>
            </div>
          )}

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingStall ? "Edit Stall" : "Create New Stall"}</DialogTitle>
              </DialogHeader>
              {selectedZone && (
                <StallForm
                  stall={editingStall}
                  zoneId={selectedZone.id}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
