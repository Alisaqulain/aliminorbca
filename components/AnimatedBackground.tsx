'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true, 
      antialias: true 
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create multiple trains
    const trains: THREE.Group[] = []
    const trainCount = 5

    for (let i = 0; i < trainCount; i++) {
      const trainGroup = new THREE.Group()
      
      // Train body with gradient effect
      const bodyGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.4)
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: i % 2 === 0 ? 0x3b82f6 : 0x6366f1,
        metalness: 0.7, 
        roughness: 0.3 
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      trainGroup.add(body)

      // Windows
      for (let j = 0; j < 2; j++) {
        const windowGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.05)
        const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x1e293b })
        const window = new THREE.Mesh(windowGeometry, windowMaterial)
        window.position.set(-0.4 + j * 0.3, 0.1, 0.2)
        trainGroup.add(window)
      }

      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16)
      const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1e293b })
      for (let k = 0; k < 3; k++) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
        wheel.rotation.z = Math.PI / 2
        wheel.position.set(-0.5 + k * 0.5, -0.3, 0)
        trainGroup.add(wheel)
      }

      // Position trains at different depths and positions
      const depth = -8 - i * 3
      const yPos = (Math.random() - 0.5) * 4
      const xPos = (Math.random() - 0.5) * 6
      
      trainGroup.position.set(xPos, yPos, depth)
      trainGroup.scale.set(0.6, 0.6, 0.6)
      
      scene.add(trainGroup)
      trains.push(trainGroup)
    }

    // Add rails
    for (let i = 0; i < 3; i++) {
      const railGeometry = new THREE.BoxGeometry(20, 0.05, 0.05)
      const railMaterial = new THREE.MeshStandardMaterial({ color: 0x64748b })
      const rail = new THREE.Mesh(railGeometry, railMaterial)
      rail.position.set(0, -2 + i * 2, -10 - i * 2)
      rail.rotation.y = Math.PI / 2
      scene.add(rail)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)
    
    const directionalLight1 = new THREE.DirectionalLight(0x3b82f6, 0.4)
    directionalLight1.position.set(5, 5, 5)
    scene.add(directionalLight1)
    
    const directionalLight2 = new THREE.DirectionalLight(0x6366f1, 0.3)
    directionalLight2.position.set(-5, -5, 5)
    scene.add(directionalLight2)

    camera.position.set(0, 0, 5)

    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      // Animate trains
      trains.forEach((train, index) => {
        // Move trains along tracks
        train.position.x += 0.01 + index * 0.005
        train.rotation.y = Math.sin(Date.now() * 0.0005 + index) * 0.1
        
        // Reset position when train goes off screen
        if (train.position.x > 8) {
          train.position.x = -8
          train.position.y = (Math.random() - 0.5) * 4
        }
      })
      
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-purple-50/40"></div>
    </div>
  )
}

