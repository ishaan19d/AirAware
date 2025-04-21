import { useEffect, useRef } from 'react'

const AirParticlesAnimation = () => {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', resize)
    resize()
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.opacity = Math.random() * 0.5 + 0.1
        
        // Determine color based on size (simulate different types of particles)
        if (this.size < 2) {
          this.color = 'rgba(173, 216, 230, ' + this.opacity + ')' // Light blue for small particles
        } else if (this.size < 4) {
          this.color = 'rgba(255, 255, 255, ' + this.opacity + ')' // White for medium particles
        } else {
          this.color = 'rgba(135, 206, 250, ' + this.opacity + ')' // Sky blue for larger particles
        }
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX
        }
        
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY
        }
      }
      
      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Create particle array
    let particlesArray = []
    const numberOfParticles = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000))
    
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.4 }}
    />
  )
}

export default AirParticlesAnimation