"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";

type ImageUploadProps = {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
};

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to upload image.",
        );
      }

      if (!data.secure_url) {
        throw new Error(
          "Cloudinary did not return an image URL.",
        );
      }

      onChange(data.secure_url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload image.",
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#262631]">
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            handleUpload(file);
          }
        }}
      />

      {!value ? (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[150px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#c7c4d7] bg-[#fafaff] px-6 transition hover:border-[#6466e8] hover:bg-[#f7f6ff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin text-[#6466e8]" />

              <span className="mt-3 text-sm font-semibold text-[#6466e8]">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-[#6466e8]" />

              <span className="mt-3 text-sm font-semibold text-[#464554]">
                Choose Image
              </span>

              <span className="mt-1 text-xs text-[#9ca3af]">
                JPG, PNG, WEBP or other image formats
              </span>
            </>
          )}
        </button>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E4E2F0] bg-white">
          <div className="relative h-[220px] w-full bg-[#f7f7fa]">
            <Image
              src={value}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#E4E2F0] p-4">
            <p className="min-w-0 flex-1 truncate text-xs text-[#777584]">
              {value}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-[#d8d5e4] px-3 py-2 text-xs font-semibold text-[#555462] transition hover:bg-[#F8F7FF]"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload size={14} />
                )}

                Replace
              </button>

              <button
                type="button"
                disabled={uploading}
                onClick={() => onChange("")}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}