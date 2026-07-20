import type { User } from "@/shared/type"
import { supabase } from "@/api/database/client"

const TARGET_USER_ID = "b9c92921-8c4b-41ad-bc27-24bd96e17999"

const DEFAULT_USER: User = {
  id: TARGET_USER_ID,
  displayName: "Nguyễn Văn A",
  email: "vana.intern@taskmaster.pro",
  role: "Frontend Engineering Intern",
}

function parseDbRowToUser(row: any): User {
  return {
    id: row.id || TARGET_USER_ID,
    displayName: row.display_name || row.displayName || "Nguyễn Văn A",
    email: row.email || "vana.intern@taskmaster.pro",
    role: row.role || "Frontend Engineering Intern",
  }
}

// GET /users/:id
export async function fetchUser(id: string | number): Promise<User> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single()
    console.log(data)
    if (!error && data) {
      return parseDbRowToUser(data)
    }
  } catch (err) {
    console.warn(`Could not fetch user ${id} from Supabase, returning default user:`, err)
  }
  return DEFAULT_USER
}

// PUT /users
export async function updateUser(payload: Partial<User>): Promise<User> {
  const userId = payload.id || TARGET_USER_ID
  const dbPayload = {
    id: userId,
    display_name: payload.displayName,
    email: payload.email,
    role: payload.role,
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .upsert([dbPayload])
      .select()
      .single()

    if (!error && data) {
      return parseDbRowToUser(data)
    }
  } catch (err) {
    console.warn("Could not upsert user into Supabase:", err)
  }

  return {
    ...DEFAULT_USER,
    ...payload,
    id: userId,
  }
}

// POST /settings
export async function postSaveSettings(payload: unknown): Promise<unknown> {
  return payload
}
