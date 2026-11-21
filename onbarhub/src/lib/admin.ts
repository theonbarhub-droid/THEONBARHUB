// Accounts allowed to see the private admin dashboard. The database enforces
// this too (see supabase/events.sql is_admin()); this list is for the UI.
export const ADMIN_EMAILS = ["kumarkartik9582@gmail.com", "theonbarhub@gmail.com"];

export function isAdminEmail(email: string | undefined | null): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}
