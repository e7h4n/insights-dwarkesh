"use client"

import { useState } from "react"

interface OpinionCardProps {
  speaker: string
  date: string
  bucket: string
  topic: string
  topicColor: string
  stance: string
  confidence: "Confident" | "Hedged" | "Speculative"
  onSpeakerClick?: (speaker: string) => void
}

const CONFIDENCE_META: Record<"Confident" | "Hedged" | "Speculative", { filled: number; color: string }> = {
  Confident: { filled: 3, color: "#10b981" },
  Hedged:    { filled: 2, color: "#f59e0b" },
  Speculative: { filled: 1, color: "#8b5cf6" },
}

function ConfidenceDots({ confidence }: { confidence: "Confident" | "Hedged" | "Speculative" }) {
  const { filled, color } = CONFIDENCE_META[confidence]
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: i <= filled ? color : "#333333" }}
        />
      ))}
      <span className="text-[11px] font-medium ml-0.5" style={{ color }}>
        {confidence}
      </span>
    </div>
  )
}

export function OpinionCard({
  speaker,
  date,
  bucket,
  topic,
  topicColor,
  stance,
  confidence,
  onSpeakerClick,
}: OpinionCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 cursor-default"
      style={{
        background: "#1a1a1a",
        border: `1px solid ${hovered ? `${topicColor}50` : "#2a2a2a"}`,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px ${topicColor}28` : "none",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        breakInside: "avoid",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <button
          className="font-semibold text-[13px] leading-none text-left transition-colors duration-100 cursor-pointer"
          style={{ color: hovered ? topicColor : "#f0f0f0" }}
          onClick={() => onSpeakerClick?.(speaker)}
          title={`Filter by ${speaker}`}
        >
          {speaker}
        </button>
        <span className="text-[11px] tabular-nums shrink-0 mt-0.5" style={{ color: "#888888" }}>
          {date}
        </span>
      </div>

      {/* Topic pill */}
      <div>
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
          style={{
            background: `${topicColor}1a`,
            color: topicColor,
            borderColor: `${topicColor}40`,
          }}
        >
          {bucket}
        </span>
      </div>

      {/* Stance */}
      <p className="text-[13px] leading-relaxed flex-1" style={{ color: "#c8c8c8" }}>
        &ldquo;{stance}&rdquo;
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid #242424" }}>
        <ConfidenceDots confidence={confidence} />
        <span className="text-[11px]" style={{ color: "#555555" }}>
          {topic}
        </span>
      </div>
    </div>
  )
}
