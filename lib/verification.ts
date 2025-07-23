import { supabase } from "./supabase";

export const uploadVerificationDocument = async (userId: string, file: File) => {
  const filePath = `verification-documents/${userId}/${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("agent-verification")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from("agent-verification")
    .getPublicUrl(filePath);

  return publicUrl;
};

export const updateUserVerificationStatus = async (userId: string, documentUrl: string, documentType: string) => {
  const { data, error } = await supabase
    .from("verifications")
    .update({ 
      document_url: documentUrl,
      document_type: documentType,
      status: 'pending',
      submitted_at: new Date().toISOString(),
     })
    .eq("user_id", userId)
    .select();

  if (error) {
    // If the update fails, it might be because a record doesn't exist. Let's try to insert.
    if (error.code === 'PGRST204') { // PostgREST error for no rows found
        const { data: insertData, error: insertError } = await supabase
            .from('verifications')
            .insert([
                {
                    user_id: userId,
                    document_url: documentUrl,
                    document_type: documentType,
                    status: 'pending',
                    submitted_at: new Date().toISOString(),
                },
            ])
            .select();
        
        if (insertError) {
            throw new Error(insertError.message);
        }
        return insertData;
    }
    throw new Error(error.message);
  }

  return data;
};

export const getVerificationStatus = async (userId: string) => {
    const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore 'single row not found' error
        throw new Error(error.message);
    }

    return data;
};
