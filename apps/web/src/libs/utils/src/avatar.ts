export function getAvatarSeed(displayName: string) {
  return encodeURIComponent(displayName || "user")
}

export function getInitials(displayName: string) {
  return displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"
}

export function getAvatarUrl(displayName: string) {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${getAvatarSeed(displayName)}`
}
