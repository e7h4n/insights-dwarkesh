"use client"

import { useMemo, useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { OpinionCard } from "@/components/opinion-card"
import { FilterBar, type ActiveFilter } from "@/components/filter-bar"
import { DataPointsTable } from "@/components/data-points-table"
import { DATA, BUCKET_COLORS, CF_MAP } from "@/lib/data"

type Confidence = "All" | "Confident" | "Hedged" | "Speculative"

const CF_CODE: Record<Confidence, string | null> = {
  All: null,
  Confident: "c",
  Hedged: "h",
  Speculative: "s",
}

export default function DwarkeshInsights() {
  const [search, setSearch] = useState("")
  const [activeConfidence, setActiveConfidence] = useState<Confidence>("All")
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  const [showDataPoints, setShowDataPoints] = useState(false)

  const cfCode = CF_CODE[activeConfidence]

  // Filtered opinions — recomputed on every state change
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return DATA.opinions.filter((op) => {
      if (q) {
        const haystack = `${op.sp} ${op.tp} ${op.st}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (cfCode && op.cf !== cfCode) return false
      if (activeTopic && op.bk !== activeTopic) return false
      if (activeSpeaker && op.sp !== activeSpeaker) return false
      return true
    })
  }, [search, cfCode, activeTopic, activeSpeaker])

  // Build active filter pills
  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const pills: ActiveFilter[] = []
    if (activeTopic) {
      pills.push({
        key: "topic",
        label: `Topic: ${activeTopic}`,
        color: BUCKET_COLORS[activeTopic],
        onRemove: () => setActiveTopic(null),
      })
    }
    if (activeSpeaker) {
      pills.push({
        key: "speaker",
        label: `Speaker: ${activeSpeaker}`,
        onRemove: () => setActiveSpeaker(null),
      })
    }
    if (activeConfidence !== "All") {
      pills.push({
        key: "confidence",
        label: `Confidence: ${activeConfidence}`,
        onRemove: () => setActiveConfidence("All"),
      })
    }
    if (search.trim()) {
      pills.push({
        key: "search",
        label: `Search: "${search.trim()}"`,
        onRemove: () => setSearch(""),
      })
    }
    return pills
  }, [activeTopic, activeSpeaker, activeConfidence, search])

  const clearAll = () => {
    setSearch("")
    setActiveConfidence("All")
    setActiveTopic(null)
    setActiveSpeaker(null)
  }

  const handleSpeakerClick = (speaker: string) => {
    setActiveSpeaker((prev) => (prev === speaker ? null : speaker))
    setActiveTopic(null)
    if (showDataPoints) setShowDataPoints(false)
  }

  const handleToggleDataPoints = () => {
    setShowDataPoints((prev) => !prev)
  }

  const isFiltered =
    activeTopic || activeSpeaker || activeConfidence !== "All" || search.trim()

  return (
    <div className="min-h-screen font-sans" style={{ background: "#0f0f0f", color: "#f0f0f0" }}>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        activeConfidence={activeConfidence}
        onConfidenceChange={setActiveConfidence}
      />

      <FilterBar filters={activeFilters} />

      <Sidebar
        activeTopic={activeTopic}
        onTopicChange={setActiveTopic}
        activeSpeaker={activeSpeaker}
        onSpeakerChange={setActiveSpeaker}
        showDataPoints={showDataPoints}
        onToggleDataPoints={handleToggleDataPoints}
        filteredCount={filtered.length}
      />

      {/* Main content offset by sticky topbar (56px) + filter bar (34px) */}
      <main className="min-h-screen" style={{ marginLeft: 220 }}>
        {showDataPoints ? (
          <>
            {/* Data points header */}
            <div
              className="flex items-center justify-between px-6 py-3 border-b"
              style={{ borderColor: "#1e1e1e" }}
            >
              <span className="text-sm font-medium" style={{ color: "#f0f0f0" }}>
                {DATA.dataPoints.length} data points
              </span>
            </div>
            <DataPointsTable />
          </>
        ) : (
          <>
            {/* Results header */}
            <div
              className="flex items-center justify-between px-6 py-3 border-b"
              style={{ borderColor: "#1e1e1e" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium tabular-nums transition-all duration-200"
                  style={{ color: "#f0f0f0" }}
                >
                  {filtered.length} opinion{filtered.length !== 1 ? "s" : ""}
                </span>
                {isFiltered && (
                  <span className="text-[12px]" style={{ color: "#555555" }}>
                    · filtered from {DATA.opinions.length}
                  </span>
                )}
              </div>
              {isFiltered && (
                <button
                  onClick={clearAll}
                  className="text-[11px] px-2.5 py-1 rounded-md transition-colors duration-150 hover:bg-[#1e1e1e]"
                  style={{ color: "#666666", border: "1px solid #2a2a2a" }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Cards masonry grid */}
            {filtered.length > 0 ? (
              <div
                className="p-5"
                style={{
                  columns: "3 260px",
                  columnGap: 16,
                  transition: "all 0.2s ease",
                }}
              >
                {filtered.map((op) => {
                  const color = BUCKET_COLORS[op.bk] ?? "#6b7280"
                  const confidence = CF_MAP[op.cf as "c" | "h" | "s"]
                  return (
                    <div
                      key={op.id}
                      className="mb-4"
                      style={{
                        breakInside: "avoid",
                        animation: "fadeIn 0.2s ease",
                      }}
                    >
                      <OpinionCard
                        speaker={op.sp}
                        date={op.dt}
                        bucket={op.bk}
                        topic={op.tp}
                        topicColor={color}
                        stance={op.st}
                        confidence={confidence}
                        onSpeakerClick={handleSpeakerClick}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-36 gap-3">
                <span className="text-3xl select-none" style={{ color: "#2a2a2a" }}>
                  ◎
                </span>
                <p className="text-sm" style={{ color: "#666666" }}>
                  No opinions match the current filters.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-1 text-[12px] px-3 py-1.5 rounded-md transition-colors duration-150 hover:bg-[#1e1e1e]"
                  style={{ color: "#888888", border: "1px solid #2a2a2a" }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
