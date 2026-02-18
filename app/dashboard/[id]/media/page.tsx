"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import ImageCropUploader from '@/components/imageuploader';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ImageFile {
  id: string;
  name: string;
  url: string;
}

function MediaPage({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bucketName = 'uploads';
  const folderPath = params.id; // Using user/agent id as the folder

  useEffect(() => {
    async function fetchImages() {
      setIsLoading(true);
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list(folderPath, { limit: 100 });

      if (error) {
        toast({ title: 'Error fetching images', description: error.message, variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      if (files) {
        const imageUrls = files.map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(`${folderPath}/${file.name}`);
          return { id: file.id, name: file.name, url: publicUrl };
        });
        setImages(imageUrls);
      }
      setIsLoading(false);
    }

    fetchImages();
  }, [supabase, folderPath]);

  const handleUploadComplete = () => {
    toast({ title: 'Success', description: 'Image uploaded successfully. Refreshing...' });
    router.refresh();
  };

  const handleDelete = async (imageName: string) => {
    const filePath = `${folderPath}/${imageName}`;
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);

    if (error) {
      toast({ title: 'Error deleting image', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Image deleted.' });
      setImages(images.filter(img => img.name !== imageName));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Media Management</h1>
          <p className="text-sm text-muted-foreground">Upload and manage your images here.</p>
        </div>
        <ImageCropUploader
          onUploadComplete={handleUploadComplete}
          bucket={bucketName}
          folder={folderPath}
          aspectRatio={16 / 9}
          trigger={<Button>Upload Image</Button>}
        />
      </div>

      {isLoading ? (
        <p>Loading images...</p>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group border rounded-md overflow-hidden">
              <img src={image.url} alt={image.name} className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2">
                <p className="text-white text-xs text-center break-all mb-2">{image.name}</p>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(image.name)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-md">
          <p>No images found.</p>
          <p className="text-sm text-gray-500">Upload your first image to see it here.</p>
        </div>
      )}
    </div>
  );
}

export default MediaPage;
