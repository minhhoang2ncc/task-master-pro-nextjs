const { createClient } = require('@supabase/supabase-js')
const client = createClient('http://localhost', 'anon-key', {
  global: { headers: { Authorization: 'Bearer my-token' } },
  auth: { persistSession: false, autoRefreshToken: false }
})
console.log(client.auth.session)
