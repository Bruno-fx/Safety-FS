'use server';

export async function verifyAdminPassword(password: string) {
  // Reads the password directly from your secure environment variables
  const correctPassword = process.env.ADMIN_PASSWORD;
  
  if (!correctPassword) {
    console.error("Server Error: ADMIN_PASSWORD is not set in .env.local");
    return false;
  }
  
  return password === correctPassword;
}