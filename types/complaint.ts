// types/complaint.ts

export type ComplaintStatus = "pending" | "in_progress" | "resolved" | "closed";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  note?: string;
  status: ComplaintStatus;
  // เพิ่ม field อื่นๆ ที่เกี่ยวข้องกับการร้องเรียนของคุณที่นี่
  // created_at: string;
  // created_by: string;
  // location: string;
  // contact: string;
  // type: string;
}