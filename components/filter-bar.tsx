"use client"

import { X } from "lucide-react"

export interface ActiveFilter {
  key: string
  label: string
  color?: string
  onRemove: () => void
}

interface FilterBarProps {
  filters: ActiveFilter[]
}

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <div
      className="sticky top-14 z-20 flex items-center gap-2 px-5 min-h-[34px] border-b"
      style={{ borderColor: "#1e1e1e", background: "#0a0a0a" }}
    >
      {filters.length === 0 ? (
        <span className="text-[11px] select-none" style={{ color: "#383838" }}>
          No active filters
        </span>
      ) : (
        <>
          <span
            className="text-[10px] uppercase tracking-widest font-semibold select-none shrink-0"
            style={{ color: "#444444" }}
          >
            Filters:
          </span>
          {filters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border"
              style={{
                background: f.color ? `${f.color}15` : "#1a1a1a",
                color: f.color ?? "#e0e0e0",
                borderColor: f.color ? `${f.color}40` : "#2a2a2a",
              }}
            >
              {f.label}
              <button
                onClick={f.onRemove}
                className="ml-0.5 transition-opacity hover:opacity-60"
                aria-label={`Remove ${f.label} filter`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </>
      )}
    </div>
  )
}
