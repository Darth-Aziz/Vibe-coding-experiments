import * as React from "react"
import { cn } from "../../../lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-full w-full bg-background overflow-hidden font-sans">
      {/* Dark Sidebar */}
      <aside className="w-16 md:w-64 bg-admin-sidebar-bg text-admin-sidebar-text flex-shrink-0 flex flex-col border-r border-admin-sidebar-border transition-all">
        <div className="h-12 md:h-16 flex items-center justify-center md:justify-start px-2 md:px-6 border-b border-admin-sidebar-border">
          <span className="hidden md:inline text-lg font-bold">Tasheel Admin</span>
          <span className="md:hidden text-lg font-bold">TA</span>
        </div>
        <nav className="flex-1 p-2 md:p-4 space-y-2 overflow-y-auto">
          {['Dashboard', 'Services', 'Forms', 'Workflows', 'Settings'].map((item) => (
            <a
              key={item}
              href="#"
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-admin-sidebar-hover text-admin-sidebar-muted hover:text-admin-sidebar-text transition-colors text-center md:text-left truncate"
            >
              <span className="hidden md:inline">{item}</span>
              <span className="md:hidden">{item.substring(0, 1)}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-secondary/20 overflow-hidden">
        <header className="h-12 md:h-16 flex items-center px-4 md:px-6 border-b bg-background flex-shrink-0">
          <h1 className="text-lg md:text-xl font-semibold truncate">Admin Portal</h1>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}