if (!window.particlesInitialized) {
    window.particlesInitialized = true;
  
    // Crear el canvas dinámicamente
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.prepend(canvas); // Se agrega al inicio del body
    const ctx = canvas.getContext("2d");
  
    let particles = [];
    let numParticles = 100; // Puedes ajustar la cantidad de partículas
  
    // Ajustar tamaño del canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    }
  
    // Crear las partículas
    function createParticles() {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        ));
      }
    }
  
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2.5 + 1;
        this.hue = Math.random() * 360;
      }
  
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
      }
  
      draw(ctx) {
        ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 0.8)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  
    function drawBackground() {
      ctx.fillStyle = "rgba(15, 15, 30, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  
    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < 100) {
            ctx.strokeStyle = `hsla(${(particles[i].hue + particles[j].hue) / 2}, 100%, 50%, ${1 - distance / 100})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
  
    function animate() {
      drawBackground();
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
  
      connectParticles();
      requestAnimationFrame(animate);
    }
  
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();
  }
  