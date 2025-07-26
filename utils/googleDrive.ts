/**
 * Google Drive helper functions for upload / delete files & refresh access token.
 */

export async function refreshGoogleToken(refreshToken: string, supabase: any): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) throw new Error("Failed to refresh Google token");

  const { access_token, expires_in } = await res.json();
  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

  // Update DB
  await supabase
    .from("user_tokens")
    .update({ access_token, expires_at: expiresAt })
    .eq("refresh_token", refreshToken);

  return access_token;
}

export async function uploadToGoogleDrive(file: Blob, accessToken: string, folderId: string) {
  const metadata = {
    name: `image_${Date.now()}.jpg`,
    parents: [folderId],
  };

  const formData = new FormData();
  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  formData.append("file", file);

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload to Google Drive");
  return res.json();
}

export async function deleteGoogleDriveFile(fileId: string, accessToken: string) {
  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
