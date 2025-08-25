"use client"

import { useState, useEffect } from "react"
import type { Zone } from "@/types"
import { api } from "@/lib/api"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ZoneForm } from "@/components/zone-form"
import { ProtectedRoute } from "@/components/protected-route"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Building2 } from "lucide-react"

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingZone, setEditingZone] = useState<Zone | undefined>()
  const [error, setError] = useState("")

  useEffect(() => {
    loadZones()
  }, [])

  const loadZones = async () => {
    try {
      setLoading(true)
      const response = await api.getZones()
      if (response.status === "successful") {
        setZones(response.results)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load zones"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone)
    setShowDialog(true)
  }

  const handleDelete = async (zone: Zone) => {
    const stallCount = zone.stalls?.length || 0
    const confirmMessage = stallCount > 0 
      ? `Are you sure you want to delete "${zone.zoneName}"?\n\nThis zone contains ${stallCount} stall${stallCount === 1 ? '' : 's'}. You must delete all stalls first before deleting the zone.`
      : `Are you sure you want to delete "${zone.zoneName}"?\n\nThis action cannot be undone.`
    
    if (window.confirm(confirmMessage)) {
      try {
        setError("") // Clear any previous errors
        await api.deleteZone(zone.id)
        await loadZones()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete zone"
        
        // Handle specific error messages more gracefully
        if (errorMessage.includes("Cannot delete zone that contains stalls")) {
          setError("Cannot delete this zone because it contains stalls. Please delete all stalls in this zone first before trying to delete the zone.")
        } else {
          setError(errorMessage)
        }
      }
    }
  }

  const handleSuccess = () => {
    setShowDialog(false)
    setEditingZone(undefined)
    setError("") // Clear any errors when successful action occurs
    loadZones()
  }

  const handleCancel = () => {
    setShowDialog(false)
    setEditingZone(undefined)
  }

  return (
    <ProtectedRoute fallback={<LoginForm />}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Zone Management</h1>
              <p className="text-muted-foreground">Create and manage exhibition zones</p>
            </div>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Zone
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-8">Loading zones...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {zones.map((zone) => (
                <Card key={zone.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: zone.colorCode }} />
                        <Badge variant="secondary">ID: {zone.id}</Badge>
                      </div>
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl">{zone.zoneName}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {zone.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center justify-between">
                        <span>Stalls: {zone.stalls?.length || 0}</span>
                        {zone.stalls && zone.stalls.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Has stalls
                          </Badge>
                        )}
                      </div>
                      <div>Created: {new Date(zone.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(zone)} className="flex-1">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(zone)}
                        className={`flex-1 ${zone.stalls && zone.stalls.length > 0 
                          ? 'text-muted-foreground hover:text-muted-foreground opacity-60' 
                          : 'text-destructive hover:text-destructive'
                        }`}
                        title={zone.stalls && zone.stalls.length > 0 
                          ? 'Cannot delete zone that contains stalls' 
                          : 'Delete zone'
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && zones.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No zones found</h3>
              <p className="text-muted-foreground mb-4">Create your first zone to get started</p>
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Zone
              </Button>
            </div>
          )}

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingZone ? "Edit Zone" : "Create New Zone"}</DialogTitle>
              </DialogHeader>
              <ZoneForm zone={editingZone} onSuccess={handleSuccess} onCancel={handleCancel} />
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
