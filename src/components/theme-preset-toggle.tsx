"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"

const PRESETS = ["theme-hologram","theme-neptune","theme-noir"] as const
type Preset = typeof PRESETS[number]

function applyPreset(p: Preset) {
  document.body.classList.remove(...PRESETS)
  document.body.classList.add(p)
  localStorage.setItem("crset-preset", p)
}

export function ThemePresetToggle() {
  const [preset, setPreset] = useState<Preset>("theme-hologram")

  useEffect(() => {
    const saved = (localStorage.getItem("crset-preset") as Preset) || "theme-hologram"
    setPreset(saved)
    applyPreset(saved)
  }, [])

  function next() {
    const idx = PRESETS.indexOf(preset)
    const p = PRESETS[(idx + 1) % PRESETS.length]
    setPreset(p)
    applyPreset(p)
  }

  const label = preset.replace("theme-","")
  return (
    <Button variant="ghost" size="icon" aria-label="Trocar preset de tema" title={`Tema: ${label}`} onClick={next}>
      <Palette className="h-5 w-5" />
    </Button>
  )
}
