"use client";

import type React from "react";

import { useState } from "react";
import type { Zone, CreateZoneData } from "@/types";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface ZoneFormProps {
  zone?: Zone;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ZoneForm({ zone, onSuccess, onCancel }: ZoneFormProps) {
  const [formData, setFormData] = useState<CreateZoneData>({
    zoneName: zone?.zoneName || "",
    description: zone?.description || "",
    imageUrl: zone?.imageUrl || "",
    colorCode: zone?.colorCode || "#3B82F6",
    qrCode: zone?.qrCode || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (zone?.id) {
        await api.updateZone(zone.id, formData);
      } else {
        await api.createZone(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="zoneName">Zone Name *</Label>
        <Input
          id="zoneName"
          value={formData.zoneName}
          onChange={(e) =>
            setFormData({ ...formData, zoneName: e.target.value })
          }
          placeholder="Enter zone name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter zone description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          label="Zone Image"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="colorCode">Color Code *</Label>
        <div className="flex space-x-2">
          <Input
            id="colorCode"
            type="color"
            value={formData.colorCode}
            onChange={(e) =>
              setFormData({ ...formData, colorCode: e.target.value })
            }
            className="w-16 h-10 p-1"
          />
          <Input
            value={formData.colorCode}
            onChange={(e) =>
              setFormData({ ...formData, colorCode: e.target.value })
            }
            placeholder="#3B82F6"
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="qrCode">QR Code ID</Label>
        <Input
          id="qrCode"
          value={formData.qrCode}
          onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
          placeholder="Enter QR code identifier"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {zone ? "Update Zone" : "Create Zone"}
        </Button>
      </div>
    </form>
  );
}
