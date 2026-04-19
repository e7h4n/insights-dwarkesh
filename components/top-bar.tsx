"use client"

import { Search } from "lucide-react"

type ConfidenceFilter = "All" | "Confident" | "Hedged" | "Speculative"

const CONFIDENCE_FILTERS: ConfidenceFilter[] = ["All", "Confident", "Hedged", "Speculative"]

const CONFIDENCE_COLORS: Record<ConfidenceFilter, string> = {
  All: "#f0f0f0",
  Confident: "#10b981",
  Hedged: "#f59e0b",
  Speculative: "#8b5cf6",
}

interface TopBarProps {
  search: string
  onSearchChange: (v: string) => void
  activeConfidence: ConfidenceFilter
  onConfidenceChange: (v: ConfidenceFilter) => void
}

export function TopBar({ search, onSearchChange, activeConfidence, onConfidenceChange }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-4 px-5 h-14"
      style={{
        background: "var(--topbar)",
        borderBottom: "1px solid var(--topbar-border)",
      }}
    >
      {/* Left — branding */}
      <div className="flex flex-col justify-center min-w-0 shrink-0 mr-2">
        <span className="font-bold text-sm leading-none" style={{ color: "#f0f0f0" }}>
          Dwarkesh Insights
        </span>
        <span className="text-[11px] mt-0.5 whitespace-nowrap" style={{ color: "#888888" }}>
          459 opinions · 54 episodes · 47 speakers
        </span>
      </div>

      {/* Center — search */}
      <div className="flex-1 flex items-center gap-2 max-w-md mx-auto">
        <div
          className="flex items-center gap-2 w-full rounded-lg px-3 h-8 border"
          style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}
        >
          <Search size={13} style={{ color: "#888888", flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search opinions..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-[#888888] min-w-0"
            style={{ color: "#f0f0f0" }}
          />
        </div>
      </div>

      {/* Right — confidence chips */}
      <div className="flex items-center gap-1.5 shrink-0">
        {CONFIDENCE_FILTERS.map((chip) => {
          const isActive = activeConfidence === chip
          const color = CONFIDENCE_COLORS[chip]
          return (
            <button
              key={chip}
              onClick={() => onConfidenceChange(chip)}
              className="px-2.5 h-7 rounded-md text-[11px] font-medium transition-all duration-150 cursor-pointer"
              style={{
                background: isActive ? `${color}18` : "transparent",
                color: isActive ? color : "#888888",
                border: `1px solid ${isActive ? color : "#2a2a2a"}`,
              }}
            >
              {chip}
            </button>
          )
        })}
      </div>
    </header>
  )
}
