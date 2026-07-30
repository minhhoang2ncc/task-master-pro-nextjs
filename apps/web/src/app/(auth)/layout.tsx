// Auth route group layout - no sidebar, full screen
// The root layout already handles the conditional sidebar rendering based on session.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
