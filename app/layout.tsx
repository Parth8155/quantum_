import "@/app/globals.css"
import { Inter } from 'next/font/google'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const defaultOpen = true

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
              <div className="relative min-h-screen bg-[#0F0F23] text-[#E2E8F0] flex">
                <SidebarInset className="flex-1">
                  <Header />
                  <main className="relative flex">
                    <AppSidebar className="w-64 border-r border-white/10" />
                    <div className="flex-1">{children}</div>
                  </main>
                </SidebarInset>
              </div>


            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

function Header() {
  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-[#0F0F23]/60
                 border-b border-white/10"
      role="banner"
    >
      <div className="flex h-14 items-center gap-2 px-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-md bg-gradient-to-br from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6]
                       shadow-[0_0_24px_rgba(14,165,233,0.35)]"
            aria-hidden="true"
          />
          <span className="text-lg font-semibold tracking-tight">QuantumPlayground</span>
        </div>
        <nav className="ml-6 hidden md:flex items-center gap-4 text-sm text-[#E2E8F0]/80" aria-label="Primary">
          <button className="hover:text-[#F8FAFC] transition-colors" type="button">Circuit Builder</button>
          <button className="hover:text-[#F8FAFC] transition-colors" type="button">3D Visualizer</button>
          <button className="hover:text-[#F8FAFC] transition-colors" type="button">Learning Hub</button>
          <button className="hover:text-[#F8FAFC] transition-colors" type="button">Challenges</button>
          <button className="hover:text-[#F8FAFC] transition-colors" type="button">Profile</button>
          <button className="hover:text-[#F8FAFC] transition-colors" type="button">Settings</button>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            id="run-btn"
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40
                       hover:bg-[#10B981]/30 transition-colors shadow-[0_0_24px_rgba(16,185,129,0.25)]"
            title="Run simulation locally"
          >
            Run on Quantum (Sim)
          </button>
        </div>
      </div>
    </header>
  )
}

export const metadata = {
  generator: 'v0.dev'
};
