import { ProfileCard } from "./profile-card"
import type { User } from "@/shared/types/user"

export function Profile({
  user,
  onChange,
}: {
  user: User
  onChange: (field: keyof User, value: string) => void
}) {
  return <ProfileCard user={user} onChange={onChange} />
}
