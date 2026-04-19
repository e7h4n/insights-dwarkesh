"use client"

import { cn } from "@/lib/utils"
import { DATA, BUCKET_COLORS } from "@/lib/data"

interface SidebarProps {
  activeTopic: string | null
  onTopicChange: (t: string | null) => void
  activeSpeaker: string | null
  onSpeakerChange: (s: string | null) => void
  showDataPoints: boolean
  onToggleDataPoints: () => void
  filteredCount: number
}

// Compute real per-bucket counts from opinions
const BUCKET_COUNTS: Record<string, number> = {}
for (const op of DATA.opinions) {
  BUCKET_COUNTS[op.bk] = (BUCKET_COUNTS[op.bk] ?? 0) + 1
}

const TOTAL_COUNT = DATA.opinions.length

function SectionDivider({ label }: { label: string }) {
  return (
    <div
      className="px-3 pt-4 pb-1.5 text-[10px] font-semibold tracking-widest uppercase select-none"
      style={{ color: "#555555" }}
    >
      {label}
    </div>
  )
}

function Badge({
  count,
  color,
  active,
}: {
  count: number
  color?: string
  active?: boolean
}) {
  return (
    <span
      className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium tabular-nums shrink-0"
      style={{
        background: active && color ? `${color}28` : color ? `${color}15` : "#222222",
        color: active && color ? color : color ? `${color}cc` : "#666666",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      {count}
    </span>
  )
}

export function Sidebar({
  activeTopic,
  onTopicChange,
  activeSpeaker,
  onSpeakerChange,
  showDataPoints,
  onToggleDataPoints,
  filteredCount,
}: SidebarProps) {
  const isAllActive = !activeTopic && !activeSpeaker && !showDataPoints

  return (
    <aside
      className="fixed top-14 left-0 bottom-0 z-30 flex flex-col overflow-y-auto pb-8"
      style={{
        width: 220,
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        scrollbarWidth: "none",
      }}
    >
      {/* All Opinions */}
      <button
        onClick={() => {
          onTopicChange(null)
          onSpeakerChange(null)
          if (showDataPoints) onToggleDataPoints()
        }}
        className={cn(
          "flex items-center gap-2 px-3 py-2 mx-2 mt-2 rounded-lg text-[13px] transition-all duration-150 text-left",
          isAllActive ? "bg-[#212121]" : "hover:bg-[#181818]"
        )}
        style={{ color: isAllActive ? "#f0f0f0" : "#999999" }}
      >
        <span className="font-medium">All Opinions</span>
        <Badge count={filteredCount} color="#10b981" active={isAllActive} />
      </button>

      {/* Data Points */}
      <button
        onClick={onToggleDataPoints}
        className={cn(
          "flex items-center gap-2 px-3 py-2 mx-2 rounded-lg text-[13px] transition-all duration-150 text-left",
          showDataPoints ? "bg-[#212121]" : "hover:bg-[#181818]"
        )}
        style={{ color: showDataPoints ? "#f0f0f0" : "#999999" }}
      >
        <span>Data Points</span>
        <Badge count={DATA.dataPoints.length} active={showDataPoints} />
      </button>

      {/* Topics */}
      <SectionDivider label="By Topic" />
      <div className="flex flex-col gap-px px-2">
        {DATA.buckets.map((bucket) => {
          const color = BUCKET_COLORS[bucket] ?? "#6b7280"
          const count = BUCKET_COUNTS[bucket] ?? 0
          const isActive = activeTopic === bucket && !showDataPoints
          return (
            <button
              key={bucket}
              onClick={() => {
                if (showDataPoints) onToggleDataPoints()
                onTopicChange(isActive ? null : bucket)
                onSpeakerChange(null)
              }}
              className="relative flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[12.5px] transition-all duration-150 text-left"
              style={{
                background: isActive ? `${color}14` : "transparent",
                color: isActive ? "#f0f0f0" : "#999999",
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r-full"
                  style={{ background: color }}
                />
              )}
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: isActive ? color : `${color}66` }}
              />
              <span className="truncate leading-none flex-1">{bucket}</span>
              <Badge count={count} color={color} active={isActive} />
            </button>
          )
        })}
      </div>

      {/* Speakers */}
      <SectionDivider label="By Speaker" />
      <div className="flex flex-col gap-px px-2">
        {DATA.speakers.map((speaker) => {
          const isActive = activeSpeaker === speaker.name && !showDataPoints
          return (
            <button
              key={speaker.name}
              onClick={() => {
                if (showDataPoints) onToggleDataPoints()
                onSpeakerChange(isActive ? null : speaker.name)
                onTopicChange(null)
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-[7px] rounded-lg text-[12.5px] transition-all duration-150 text-left",
                isActive ? "bg-[#212121]" : "hover:bg-[#181818]"
              )}
              style={{ color: isActive ? "#f0f0f0" : "#999999" }}
            >
              <span className="truncate flex-1">{speaker.name}</span>
              <Badge count={speaker.n} active={isActive} />
            </button>
          )
        })}
      </div>
    </aside>
  )
}
