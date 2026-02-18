"use client";

import { useState, useRef, forwardRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import "react-image-crop/dist/ReactCrop.css";

interface ImageUploaderProps {
  bucket: string;
  folder: string;
  imageUrl: string;
  onUpload: (url: string) => void;
  isEditing: boolean;
  aspectRatio: number;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const ImageUploader = forwardRef<HTMLInputElement, ImageUploaderProps>(({
  bucket,
  folder,
  imageUrl,
  onUpload,
  isEditing,
  aspectRatio,
  className,
  inputRef,
}, ref) => {
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 50, height: 50, x: 25, y: 25 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("Selected file:", file);
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "ไฟล์ใหญ่เกินไป", description: "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setIsDialogOpen(true);
          console.log("ImageSrc set, dialog opened");
        } else {
          console.error("Failed to read file as data URL");
          toast({ title: "เกิดข้อผิดพลาด", description: "ไม่สามารถอ่านไฟล์ได้", variant: "destructive" });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Image loaded for cropping");
    imgRef.current = e.currentTarget;
  };

  const getCroppedImage = async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else console.error("Failed to create blob from canvas");
      }, "image/jpeg");
    });
  };

  const handleUpload = async () => {
    if (!completedCrop || !imgRef.current) {
      toast({ title: "เกิดข้อผิดพลาด", description: "กรุณาครอบตัดภาพก่อนอัปโหลด", variant: "destructive" });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const blob = await getCroppedImage(imgRef.current, completedCrop);
      const fileName = `${user.id}/${uuidv4()}.jpg`;
      const filePath = `${folder}/${fileName}`;

      console.log("Uploading to:", filePath);
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, blob, {
          contentType: "image/jpeg",
          upsert: true,
          metadata: { owner_id: user.id },
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      console.log("Upload success, URL:", publicUrlData.publicUrl);
      onUpload(publicUrlData.publicUrl);

      setIsDialogOpen(false);
      setImageSrc(null);
      toast({ title: "อัปโหลดสำเร็จ", description: "รูปภาพได้รับการอัปเดตแล้ว" });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "เกิดข้อผิดพลาด", description: "ไม่สามารถอัปโหลดรูปภาพได้", variant: "destructive" });
    }
  };

  return (
    <>
      {isEditing && (
        <>
          <input
            type="file"
            accept="image/*"
            ref={inputRef || ref}
            onChange={handleFileChange}
            className={className || "hidden"}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ครอบตัดรูปภาพ</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {imageSrc && (
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspectRatio}
                    className="max-h-[400px] overflow-auto"
                  >
                    <img src={imageSrc} onLoad={onImageLoad} alt="Crop preview" />
                  </ReactCrop>
                )}
                {!imageSrc && <p className="text-gray-500">กรุณาเลือกไฟล์รูปภาพ</p>}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button onClick={handleUpload} disabled={!completedCrop}>
                    อัปโหลด
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
});

ImageUploader.displayName = "ImageUploader";

export default ImageUploader;