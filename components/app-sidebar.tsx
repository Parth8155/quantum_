"use client"

import { useMemo } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Beaker, Box, Braces, Compass, Gauge, Layers, MousePointer2, Sigma, Spline, Square, Waypoints } from 'lucide-react'
import { cn } from "@/lib/utils"

type GateDef = {
  key: string
  label: string
  icon: React.ComponentType<any>
  draggable?: boolean
  param?: "theta"
}

const BASIC: GateDef[] = [
  { key: "X", label: "X", icon: Square },
  { key: "Y", label: "Y", icon: Spline },
  { key: "Z", label: "Z", icon: Layers },
  { key: "H", label: "H", icon: Sigma },
  { key: "S", label: "S", icon: Box },
  { key: "T", label: "T", icon: Braces },
  { key: "P", label: "P(θ)", icon: Compass, param: "theta" },
  { key: "RX", label: "RX(θ)", icon: Waypoints, param: "theta" },
  { key: "RY", label: "RY(θ)", icon: Waypoints, param: "theta" },
  { key: "RZ", label: "RZ(θ)", icon: Waypoints, param: "theta" },
]

const MULTI: GateDef[] = [
  { key: "CNOT", label: "CNOT", icon: MousePointer2 },
]

const MEAS: GateDef[] = [
  { key: "MEASURE", label: "Measure Z", icon: Gauge },
]

export function AppSidebar({ className }: { className?: string }) {
  const sections = useMemo(
    () => [
      { title: "Basic Gates", items: BASIC },
      { title: "Multi-Qubit", items: MULTI },
      { title: "Measurements", items: MEAS },
    ],
    [],
  )

  return (
    <Sidebar
      variant="inset"
      className={cn("data-[variant=inset]:p-2", className)} // merge extra className
      collapsible="icon"
    >
      <div className="m-0.5 h-full rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur">
        <SidebarHeader className="px-3 pt-3 pb-1">
          <div className="text-xs text-[#94A3B8]">Gate Library</div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          {sections.map((sec) => (
            <SidebarGroup key={sec.title}>
              <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-[#64748B]">
                {sec.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sec.items.map((g) => (
                    <SidebarMenuItem key={g.key}>
                      <SidebarMenuButton asChild className="!h-auto !py-2">
                        <div
                          role="button"
                          tabIndex={0}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "application/x-quantum-gate",
                              JSON.stringify({ type: g.key, param: g.param }),
                            )
                            e.dataTransfer.effectAllowed = "copy"
                          }}
                          className={cn(
                            "group flex items-center gap-2 rounded-md border border-white/10 px-2 py-2",
                            "bg-white/[0.03] hover:bg-white/[0.06] transition-colors",
                            "shadow-[0_0_24px_rgba(59,130,246,0.15)]",
                          )}
                          title={`Drag ${g.label} to the canvas`}
                        >
                          <g.icon className="size-4 text-[#0EA5E9]" />
                          <span className="font-mono">{g.label}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="px-3 pb-3 pt-1">
          <div className="text-xs text-[#64748B] flex items-center gap-1">
            <Beaker className="size-3.5" /> Quantum Professional
          </div>
        </SidebarFooter>
        <SidebarRail />
      </div>
    </Sidebar>
  )
}
