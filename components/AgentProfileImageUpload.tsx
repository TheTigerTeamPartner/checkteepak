"use client";

import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { supabase } from "@/lib/supabase";
import { getCroppedImg } from "@/utils/imageUtils";
import {
  refreshGoogleToken,
  uploadToGoogleDrive,
  deleteGoogleDriveFile,
} from "@/utils/googleDrive";

interface Props {
  agentId: string;
  userId: string;
}

const AgentProfileImageUpload: React.FC<Props> = ({ agentId, userId }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageType, setImageType] = useState<"profile" | "cover" | null>(null);

  // Load existing images once
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("image_url, cover_image_url")
        .eq("id", agentId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error(error);
        setError("ไม่สามารถโหลดรูปภาพได้");
      } else if (data) {
        setProfileImage(data.image_url);
        setCoverImage(data.cover_image_url);
      }
    };
    fetchImages();
  }, [agentId]);

  // Validate & open cropper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("กรุณาเลือกไฟล์ JPG หรือ PNG เท่านั้น");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setImageType(type);
      setShowCropper(true);
    };
    reader.onerror = () => setError("ไม่สามารถอ่านไฟล์ได้");
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: any, pixels: any) => setCroppedAreaPixels(pixels), []);

  // Upload logic
  const handleUpload = async () => {
    if (!croppedAreaPixels || !imageSrc || !imageType) return;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Crop
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // 2. Retrieve token
      const { data: tokenData, error: tokenError } = await supabase
        .from("user_tokens")
        .select("access_token, expires_at, refresh_token")
        .eq("user_id", userId)
        .eq("provider", "google_drive")
        .single();
      if (tokenError || !tokenData) throw new Error("ไม่พบ Google Drive token");

      let accessToken = tokenData.access_token as string;
      if (new Date(tokenData.expires_at) < new Date()) {
        accessToken = await refreshGoogleToken(tokenData.refresh_token, supabase);
      }

      // 3. Upload
      const folderId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID as string;
      const { id: newFileId } = await uploadToGoogleDrive(croppedBlob, accessToken, folderId);
      const imageUrl = `https://drive.google.com/uc?id=${newFileId}`;

      // 4. Delete old if exist
      const { data: oldRow } = await supabase
        .from("agents")
        .select(imageType === "profile" ? "image_url" : "cover_image_url")
        .eq("id", agentId)
        .single();
      const oldUrl = oldRow && (imageType === "profile" ? oldRow.image_url : oldRow.cover_image_url);
      if (oldUrl) {
        const oldFileId = oldUrl.split("id=")[1];
        if (oldFileId) await deleteGoogleDriveFile(oldFileId, accessToken);
      }

      // 5. Save new URL
      const updateData = imageType === "profile" ? { image_url: imageUrl } : { cover_image_url: imageUrl };
      const { error: dbError } = await supabase
        .from("agents")
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq("id", agentId);
      if (dbError) throw dbError;

      // 6. Update UI
      if (imageType === "profile") setProfileImage(imageUrl);
      else setCoverImage(imageUrl);
      setShowCropper(false);
    } catch (err: any) {
      console.error(err);
      setError("ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">จัดการรูปภาพ Agent</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {/* Profile */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">รูปโปรไฟล์</h3>
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profileImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => handleFileChange(e, "profile")}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </section>

        {/* Cover */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">รูปหน้าปก</h3>
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage || "https://via.placeholder.com/600x200"}
              alt="Cover"
              className="w-full h-48 object-cover rounded"
            />
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => handleFileChange(e, "cover")}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </section>

        {/* Cropper Modal */}
        {showCropper && imageSrc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
              <div className="relative w-full h-96">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={imageType === "profile" ? 1 : 16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowCropper(false)}
                  className="px-4 py-2 bg-gray-200 rounded mr-2"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  {isLoading ? "กำลังอัปโหลด..." : "บันทึก"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentProfileImageUpload;
