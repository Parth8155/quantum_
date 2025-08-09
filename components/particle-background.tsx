"use client"

import { useEffect, useMemo, useRef } from "react"

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useMemo(
    () =>
      Array.from({ length: 300 }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.0012,
        vy: (Math.random() - 0.5) * 0.0012,
        hue: Math.random() * 60 + 220, // Blue to purple range (220-280)
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
      })),
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    let raf = 0

    const resize = () => {
      // Always match window size
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      // Create cosmic background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      )
      gradient.addColorStop(0, "rgba(15, 15, 35, 0.95)")
      gradient.addColorStop(0.5, "rgba(8, 8, 20, 0.98)")
      gradient.addColorStop(1, "rgba(2, 2, 8, 1)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw connecting lines between nearby particles
      ctx.strokeStyle = "rgba(120, 119, 198, 0.1)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 0.1) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x * canvas.width, particles[i].y * canvas.height)
            ctx.lineTo(particles[j].x * canvas.width, particles[j].y * canvas.height)
            ctx.stroke()
          }
        }
      }

      // Draw particles with enhanced cosmic effects
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.twinkle += p.twinkleSpeed

        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1

        const x = p.x * canvas.width
        const y = p.y * canvas.height
        const baseAlpha = 0.2 + 0.6 * p.z
        const twinkleAlpha = baseAlpha * (0.7 + 0.3 * Math.sin(p.twinkle))
        const size = 0.8 + 2.2 * p.z

        // Create glowing effect
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
        glowGradient.addColorStop(0, `hsla(${p.hue}, 70%, 65%, ${twinkleAlpha})`)
        glowGradient.addColorStop(0.4, `hsla(${p.hue}, 60%, 55%, ${twinkleAlpha * 0.6})`)
        glowGradient.addColorStop(1, `hsla(${p.hue}, 50%, 45%, 0)`)

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(x, y, size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw core particle
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${twinkleAlpha})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [particles])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full z-0"
      aria-hidden="true"
    />
  )
}
