'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ParticleField() {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = canvasRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    canvasRef.current.appendChild(renderer.domElement)

    camera.position.z = 50

    // Create particle geometry
    const particleCount = 2000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const opacities = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
      sizes[i] = Math.random() * 2 + 0.5
      opacities[i] = Math.random() * 0.7 + 0.1
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // Shader material for particles
    const material = new THREE.PointsMaterial({
      color: 0x00ff9d,
      size: 0.3,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Additional blue particles
    const geometry2 = new THREE.BufferGeometry()
    const positions2 = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      positions2[i * 3] = (Math.random() - 0.5) * 200
      positions2[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions2[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    geometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3))

    const material2 = new THREE.PointsMaterial({
      color: 0x4a9eff,
      size: 0.2,
      transparent: true,
      opacity: 0.25,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles2 = new THREE.Points(geometry2, material2)
    scene.add(particles2)

    // Mouse tracking
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Animation loop
    let animationId: number
    let time = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.001

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.02
      targetY += (mouseY - targetY) * 0.02

      // Rotate particles
      particles.rotation.y = time * 0.05 + targetX * 0.3
      particles.rotation.x = time * 0.03 + targetY * 0.2
      particles2.rotation.y = -time * 0.03 + targetX * 0.2
      particles2.rotation.x = -time * 0.02 + targetY * 0.15

      // Subtle drift
      particles.position.y = Math.sin(time * 0.5) * 2
      particles2.position.y = Math.cos(time * 0.4) * 1.5

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      geometry.dispose()
      geometry2.dispose()
      material.dispose()
      material2.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}
