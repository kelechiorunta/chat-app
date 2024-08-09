import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
// import { app } from './app/firebase/firebaseConfig';
import { app } from './app/firebase/config';
import { cookies } from 'next/headers';
import useAuth from './custom_hooks/useAuth';
import { getActiveUser } from './custom_hooks/useAuth';

export async function middleware(request) {
    

 const active = await getActiveUser()

   const auth = getAuth(app)
   const user = auth && auth.currentUser
   

  // If the user is not authenticated, redirect to the signup page
  if ((active==[]) && !user) {
    
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow access to authenticated users
  return NextResponse.next();
}

// Specify which routes to apply the middleware to
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|signup).*)'],
};