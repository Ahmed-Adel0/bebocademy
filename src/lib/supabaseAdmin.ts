import { createClient } from '@supabase/supabase-js'

// Admin client with service_role key — bypasses RLS for privileged operations.
// IMPORTANT: Never expose this client or the service_role key to the browser.
// This file must only be imported by Server Actions or API Routes.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)
