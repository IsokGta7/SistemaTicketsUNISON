import Link from "next/link"
import Image from "next/image"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"

interface DashboardHeaderProps {
  userRole?: string
}

export function DashboardHeader({ userRole = "estudiante" }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/images/unison-logo.png"
              alt="Universidad de Sonora"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="font-bold text-unison-blue">UNISON IT Support</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <ModeToggle />
          <MainNav userRole={userRole} />
        </div>
      </div>
    </header>
  )
}
