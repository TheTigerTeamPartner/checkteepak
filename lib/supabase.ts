import { createClientComponentClient, createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/**
 * Creates a Supabase client for Client Components.
 */
export const getClientSupabase = () => {
  return createClientComponentClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
};

/**
 * Creates a Supabase client for Server Components and API Routes.
 */
export const getServerSupabase = () => {
  return createServerComponentClient({ cookies });
};

/**
 * Helper function to check if an error is an instance of Error and return its message.
 */
export function checkSupabaseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred with the database connection.";
}

/**
 * Helper function to format a Supabase-related error message.
 */
export function formatSupabaseError(error: unknown): string {
  const errorMessage = checkSupabaseError(error);
  return `Database operation failed: ${errorMessage}`;
}