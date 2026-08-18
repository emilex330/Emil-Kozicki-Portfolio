import { useEffect, useRef } from 'react'
import profile from '../data/profile.json'
import headshot from '../assets/headshot.jpeg'

const COLORS = ['#a855f7', '#ec4899', '#fb923c']
const LINK_DISTANCE = 130

function Hero() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let width = 0
        let height = 0
        let particles = []
        let frame = null

        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1
            width = canvas.clientWidth
            height = canvas.clientHeight
            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        function seedParticles() {
            const count = Math.min(70, Math.round((width * height) / 16000))
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 1.6 + 0.8,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            }))
        }

        function clampParticles() {
            for (const p of particles) {
                if (p.x > width) p.x = width
                if (p.y > height) p.y = height
            }
        }

        function render(animate) {
            ctx.clearRect(0, 0, width, height)

            for (const p of particles) {
                if (animate) {
                    p.x += p.vx
                    p.y += p.vy
                    if (p.x < 0 || p.x > width) p.vx *= -1
                    if (p.y < 0 || p.y > height) p.vy *= -1
                }
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = p.color
                ctx.globalAlpha = 0.75
                ctx.fill()
            }

            for (let i = 0; i < particles.length; i += 1) {
                for (let j = i + 1; j < particles.length; j += 1) {
                    const a = particles[i]
                    const b = particles[j]
                    const dist = Math.hypot(a.x - b.x, a.y - b.y)
                    if (dist > LINK_DISTANCE) continue

                    ctx.beginPath()
                    ctx.moveTo(a.x, a.y)
                    ctx.lineTo(b.x, b.y)
                    ctx.strokeStyle = a.color
                    ctx.globalAlpha = (1 - dist / LINK_DISTANCE) * 0.22
                    ctx.lineWidth = 1
                    ctx.stroke()
                }
            }

            ctx.globalAlpha = 1
            if (animate) frame = requestAnimationFrame(() => render(true))
        }

        resizeCanvas()
        seedParticles()
        render(!reduced)

        let lastWidth = width

        function handleResize() {
            const previousWidth = lastWidth
            resizeCanvas()

            if (Math.abs(width - previousWidth) > 40) {
                seedParticles()
                lastWidth = width
            } else {
                clampParticles()
            }

            if (reduced) render(false)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            if (frame) cancelAnimationFrame(frame)
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    return (
        <section className="hero" id="top">
            <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />

            <div className="hero__inner container">

                <div className="hero__photo-frame">
                    <img className="hero__photo" src={headshot} alt={profile.name} />
                </div>

                <h1 className="hero__name">
                    <span className="gradient-text gradient-text--animated">{profile.name}</span>
                </h1>

                <p className="hero__tagline">{profile.summary}</p>
                        <a
                            className="btn hero__resume"
                            href="/Emil_Kozicki_Resume_.pdf"
                            download
                        >
                    Download Resume
        </a>

            </div>

            <span className="hero__scroll" aria-hidden="true">
            <span className="hero__scroll-line" />
            </span>

        </section>
    )
}

export default Hero
