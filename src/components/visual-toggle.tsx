"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function VisualToggle() {
  const [on, setOn] = useState(true)

  // ler estado guardado
  useEffect(() => {
    const saved = localStorage.getItem("crset-visual-on")
    if (saved === "0") {
      setOn(false)
      hide()
    }
  }, [])

  function hide() {
    document.querySelectorAll<HTMLElement>("[data-bg-grid],[data-noise]").forEach(el => el.classList.add("hidden"))
  }
  function show() {
    document.querySelectorAll<HTMLElement>("[data-bg-grid],[data-noise]").forEach(el => el.classList.remove("hidden"))
  }

  function toggle() {
    const next = !on
    setOn(next)
    if (next) { show(); localStorage.setItem("crset-visual-on","1") }
    else { hide(); localStorage.setItem("crset-visual-on","0") }
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Toggle overlays" onClick={toggle} title={on ? "Ocultar overlays" : "Mostrar overlays"}>
      {on ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
    </Button>
  )
}
