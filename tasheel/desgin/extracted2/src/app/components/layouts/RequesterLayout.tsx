import * as React from "react"

export function RequesterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full w-full font-sans bg-secondary/30 overflow-hidden">
      {/* Light Navigation Bar */}
      <header className="h-12 md:h-16 flex items-center justify-between px-4 md:px-8 bg-requester-nav-bg border-b border-requester-nav-border shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-4 md:space-x-8">
          <span className="text-lg md:text-xl font-bold text-primary">Tasheel</span>
          <nav className="hidden md:flex items-center space-x-6">
            {['Home', 'Service Catalog', 'My Requests', 'Helpdesk'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-requester-nav-text transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            U
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-8">
        {children}
      </main>
    </div>
  )
}