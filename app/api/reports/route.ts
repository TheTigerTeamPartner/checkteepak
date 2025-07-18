import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ใช้ Service Role เพราะต้องอนุญาตให้เขียนแม้ไม่ login
);

export async function GET() {
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const json = formData.get("json");

    if (!json) {
      return NextResponse.json({ success: false, error: "Missing JSON data" }, { status: 400 });
    }

    const data = JSON.parse(json.toString());

    // Handle file upload
    const transferSlip = formData.get("transferSlip") as File | null;
    let evidenceUrls: string[] = [];

    if (transferSlip) {
      const filename = `reports/${Date.now()}_${transferSlip.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("reports") // ✅ เปลี่ยนให้ตรงกับชื่อ bucket จริงใน Supabase
        .upload(filename, transferSlip, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from("reports")
        .getPublicUrl(filename);

      evidenceUrls.push(publicUrlData.publicUrl);
    }

    // Insert into reports table
    const { error: insertError } = await supabase.from("reports").insert({
      title: data.title || data.report_type || "ไม่มีหัวข้อ",
      accommodation_name: data.accommodationName,
      phone: data.phone,
      report_type: data.reportType,
      incident_date: data.incidentDate || null,
      description: data.description,
      bank_account: data.bankAccount,
      bank_name: data.bankName,
      account_holder: data.accountHolder,
      reporter_name: data.reporterName,
      reporter_phone: data.reporterPhone,
      reporter_email: data.reporterEmail,
      facebook_profile: data.facebookProfile,
      instagram_profile: data.instagramProfile,
      line_id: data.lineId,
      tiktok_profile: data.tiktokProfile,
      website_url: data.websiteUrl,
      other_social_media: data.otherSocialMedia,
      evidence_urls: evidenceUrls,
      status: "pending",
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
