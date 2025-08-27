"use client";

import type React from "react";

import { useState } from "react";
import type { Stall, CreateStallData, StallCategory } from "@/types";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface StallFormProps {
  stall?: Stall;
  zoneId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const STALL_CATEGORIES: StallCategory[] = [
  "OTHER",
  "ART",
  "AUTOMOTIVE",
  "ENTERTAINMENT",
  "HEALTH",
  "FOOD",
  "SPORTS",
  "FASHION",
  "TECHNOLOGY",
  "EDUCATION",
  "RETAIL",
];

export function StallForm({
  stall,
  zoneId,
  onSuccess,
  onCancel,
}: StallFormProps) {
  const [formData, setFormData] = useState<CreateStallData>({
    name: stall?.name || "",
    description: stall?.description || "",
    organizer: stall?.organizer || "",
    category: stall?.category || "OTHER",
    floorNumber: stall?.floorNumber || 1,
    location: stall?.location || "",
    image: stall?.image || "",
    qrCode: stall?.qrCode || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (stall?.id) {
        await api.updateStall(stall.id, formData);
      } else {
        await api.createStall(zoneId, formData);
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
        <Label htmlFor="name">Stall Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter stall name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizer">Organizer *</Label>
        <Input
          id="organizer"
          value={formData.organizer}
          onChange={(e) =>
            setFormData({ ...formData, organizer: e.target.value })
          }
          placeholder="Enter organizer name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value: StallCategory) =>
            setFormData({ ...formData, category: value })
          }>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {STALL_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="floorNumber">Floor Number *</Label>
          <Input
            id="floorNumber"
            type="number"
            min="1"
            value={formData.floorNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                floorNumber: Number.parseInt(e.target.value) || 1,
              })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="e.g., Hall A-12"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter stall description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
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
          {stall ? "Update Stall" : "Create Stall"}
        </Button>
      </div>
    </form>
  );
}
