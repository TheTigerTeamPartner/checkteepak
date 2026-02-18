import { google } from 'googleapis';
import { Readable } from 'stream';

// ตั้งค่า OAuth 2.0
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// สร้าง URL สำหรับล็อกอิน Google
export function getAuthUrl(): string {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
}

// แลก authorization code เป็น access token
export async function getAccessToken(code: string): Promise<any> {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  return tokens;
}

// อัปโหลดไฟล์ไป Google Drive
export async function uploadImageToDrive(file: File, fileName: string): Promise<string> {
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });

  const fileMetadata = {
    name: fileName,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || 'root'],
  };

  const media = {
    mimeType: file.type,
    body: Readable.from(await file.arrayBuffer()), // แปลง File เป็น Readable stream
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    // ตั้งค่าให้ไฟล์เป็นสาธารณะ
    await drive.permissions.create({
      fileId: response.data.id,
      resource: { role: 'reader', type: 'anyone' },
    });

    return response.data.webViewLink!;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

// ตั้งค่า access token จาก session
export function setAuthFromTokens(tokens: any): void {
  oAuth2Client.setCredentials(tokens);
}