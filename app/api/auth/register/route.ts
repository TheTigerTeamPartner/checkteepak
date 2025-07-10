import { signUp } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json();
    const fullName = `${firstName} ${lastName}`.trim();

    // Use the centralized signUp function
    const { data, error } = await signUp(email, password, fullName, phone);

    if (error) {
      // Check for a specific error message if needed, otherwise use a generic one
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Sign up error:', errorMessage);
      // The error might be a Supabase error object, which has a `message` property
      return NextResponse.json({ error: `Database error saving new user: ${errorMessage}` }, { status: 400 });
    }

    return NextResponse.json({ message: 'Registration successful. Please check your email to verify your account.' }, { status: 201 });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An internal server error occurred.';
    console.error('Internal server error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
