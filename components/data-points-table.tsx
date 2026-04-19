"use client"

import { DATA } from "@/lib/data"

export function DataPointsTable() {
  // Group by date for visual separation
  const grouped = DATA.dataPoints.reduce<Record<string, typeof DATA.dataPoints>>((acc, dp) => {
    if (!acc[dp.dt]) acc[dp.dt] = []
    acc[dp.dt].push(dp)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="px-6 py-5">
      <div
        className="rounded-xl overflow-hidden border"
        style={{ borderColor: "#2a2a2a", background: "#141414" }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-[120px_1fr_160px] gap-4 px-4 py-2.5 text-[10px] uppercase tracking-widest font-semibold border-b select-none"
          style={{ color: "#555555", borderColor: "#2a2a2a", background: "#111111" }}
        >
          <span>Date</span>
          <span>Claim</span>
          <span>Speaker</span>
        </div>

        {/* Rows */}
        <div className="divide-y" style={{ borderColor: "#1e1e1e" }}>
          {sortedDates.map((date) =>
            grouped[date].map((dp, i) => (
              <div
                key={`${date}-${i}`}
                className="grid grid-cols-[120px_1fr_160px] gap-4 px-4 py-3 transition-colors duration-100 hover:bg-[#1a1a1a] group"
              >
                <span
                  className="text-[12px] tabular-nums font-mono self-start pt-px"
                  style={{ color: "#666666" }}
                >
                  {i === 0 ? date : ""}
                </span>
                <span
                  className="text-[13px] leading-relaxed"
                  style={{ color: "#d0d0d0" }}
                >
                  {dp.cl}
                </span>
                <span
                  className="text-[12px] self-start pt-px"
                  style={{ color: "#888888" }}
                >
                  {dp.sp}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
