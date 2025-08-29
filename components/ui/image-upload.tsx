"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUploadThing } from "@/lib/uploadthing";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  required = false,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [urlInput, setUrlInput] = useState<string>(value || "");
  const [error, setError] = useState<string>("");

  // Update preview when value changes from parent
  useEffect(() => {
    if (value && !selectedFile) {
      setPreviewUrl(value);
      setUrlInput(value);
    }
  }, [value, selectedFile]);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        const uploadedUrl = res[0].url;
        setPreviewUrl(uploadedUrl);
        setUrlInput(uploadedUrl);
        onChange(uploadedUrl);
        setSelectedFile(null);
        setError("");
      }
    },
    onUploadError: (error) => {
      setError(error.message);
      setSelectedFile(null);
      // Reset preview to the last valid URL
      setPreviewUrl(value || "");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (4MB limit)
      if (file.size > 4 * 1024 * 1024) {
        setError("File size must be less than 4MB");
        return;
      }

      setSelectedFile(file);
      setError("");

      // Create preview URL (only for preview, not for form data)
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Clear the URL input since we're using file upload
      setUrlInput("");
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      startUpload([selectedFile]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setUrlInput("");
    onChange("");
    setError("");
  };

  const handleUrlInput = (url: string) => {
    setUrlInput(url);
    setPreviewUrl(url);
    onChange(url);
    setSelectedFile(null); // Clear any selected file
  };

  return (
    <div className="space-y-4">
      <Label htmlFor={`image-upload-${label}`}>
        {label} {required && "*"}
      </Label>

      <div className="space-y-4">
        {/* Image Preview */}
        {previewUrl && (
          <div className="relative group">
            <div className="relative aspect-video w-full max-w-sm bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => {
                  setPreviewUrl("");
                  setError("Invalid image URL");
                }}
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                id={`image-upload-${label}`}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById(`image-upload-${label}`)?.click()
                }
                disabled={isUploading}
                className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>Choose Image</span>
              </Button>

              {selectedFile && (
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex items-center space-x-2">
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>{isUploading ? "Uploading..." : "Upload"}</span>
                </Button>
              )}
            </div>

            {selectedFile && (
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">Or enter image URL:</Label>
            <Input
              type="url"
              value={urlInput}
              onChange={(e) => handleUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isUploading}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
