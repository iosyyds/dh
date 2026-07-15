(function () {
  if (window.__particlesBgLoaded) return;
  window.__particlesBgLoaded = true;

  var canvas = document.createElement('canvas');
  canvas.id = 'particles-bg-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var W, H;
  var particles = [];
  var mouse = { x: -999, y: -999 };
  var PARTICLE_COUNT = 80;
  var CONNECT_DIST = 150;
  var MOUSE_RADIUS = 200;
  var SPEED = 0.6;
  var colors = [
    'rgba(102,126,234,', 'rgba(118,75,162,',
    'rgba(240,147,251,', 'rgba(79,172,254,',
    'rgba(245,87,108,', 'rgba(255,255,255,'
  ];
  var hue = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    var area = W * H;
    PARTICLE_COUNT = Math.min(150, Math.max(40, Math.floor(area / 15000)));
    CONNECT_DIST = Math.min(200, Math.max(80, Math.sqrt(area) / 8));
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * SPEED;
    this.vy = (Math.random() - 0.5) * SPEED;
    this.r = Math.random() * 2.5 + 0.8;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.life = Math.random() * 0.5 + 0.5;
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    this.twinkleOffset = Math.random() * Math.PI * 2;
  };

  Particle.prototype.update = function () {
    var dx = mouse.x - this.x;
    var dy = mouse.y - this.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MOUSE_RADIUS && dist > 0) {
      var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
      this.vx -= dx / dist * force;
      this.vy -= dy / dist * force;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.vx > SPEED * 1.5) this.vx *= 0.98;
    if (this.vy > SPEED * 1.5) this.vy *= 0.98;
    if (this.vx < -SPEED * 1.5) this.vx *= 0.98;
    if (this.vy < -SPEED * 1.5) this.vy *= 0.98;

    if (this.x < -50) this.x = W + 50;
    else if (this.x > W + 50) this.x = -50;
    if (this.y < -50) this.y = H + 50;
    else if (this.y > H + 50) this.y = -50;

    this.twinkleOffset += this.twinkleSpeed;
  };

  Particle.prototype.draw = function () {
    var alpha = (Math.sin(this.twinkleOffset) * 0.3 + 0.7) * this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + alpha + ')';
    ctx.fill();

    if (this.r > 1.8) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = this.color + (alpha * 0.15) + ')';
      ctx.fill();
    }
  };

  function shootingStar() {
    this.reset();
  }

  shootingStar.prototype.reset = function () {
    this.active = false;
    this.timer = Math.random() * 500 + 200;
  };

  shootingStar.prototype.trigger = function () {
    this.active = true;
    this.x = Math.random() * W * 0.8;
    this.y = Math.random() * H * 0.3;
    this.len = Math.random() * 120 + 80;
    this.speed = Math.random() * 8 + 6;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    this.life = 1;
    this.decay = Math.random() * 0.015 + 0.01;
  };

  shootingStar.prototype.update = function () {
    if (!this.active) {
      this.timer--;
      if (this.timer <= 0) this.trigger();
      return;
    }
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life -= this.decay;
    if (this.life <= 0) this.reset();
  };

  shootingStar.prototype.draw = function () {
    if (!this.active) return;
    var tailX = this.x - Math.cos(this.angle) * this.len;
    var tailY = this.y - Math.sin(this.angle) * this.len;
    var gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(255,255,255,' + (this.life * 0.8) + ')');
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + this.life + ')';
    ctx.fill();
  };

  function nebulaBlob() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.radius = Math.random() * 200 + 100;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;
    this.hue = Math.random() * 60 + 220;
    this.alpha = Math.random() * 0.03 + 0.01;
  }

  nebulaBlob.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -this.radius) this.x = W + this.radius;
    if (this.x > W + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = H + this.radius;
    if (this.y > H + this.radius) this.y = -this.radius;
  };

  nebulaBlob.prototype.draw = function () {
    var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, 'hsla(' + this.hue + ',80%,60%,' + this.alpha + ')');
    gradient.addColorStop(1, 'hsla(' + this.hue + ',80%,60%,0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  var starCount = 5;
  var stars = [];
  var nebulaCount = 3;
  var nebulas = [];

  function init() {
    resize();
    particles = [];
    stars = [];
    nebulas = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
    for (var i = 0; i < starCount; i++) {
      var s = new shootingStar();
      s.timer = Math.random() * 300;
      stars.push(s);
    }
    for (var i = 0; i < nebulaCount; i++) {
      nebulas.push(new nebulaBlob());
    }
  }

  function drawConnections() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          var alpha = (1 - dist / CONNECT_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(102,126,234,' + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseConnections() {
    for (var i = 0; i < particles.length; i++) {
      var dx = particles[i].x - mouse.x;
      var dy = particles[i].y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        var alpha = (1 - dist / MOUSE_RADIUS) * 0.4;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = 'rgba(240,147,251,' + alpha + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  function animate() {
    hue = (hue + 0.1) % 360;
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < nebulas.length; i++) {
      nebulas[i].update();
      nebulas[i].draw();
    }

    drawConnections();
    drawMouseConnections();

    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    for (var i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }

    requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', function () {
    mouse.x = -999;
    mouse.y = -999;
  });

  document.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  document.addEventListener('touchend', function () {
    mouse.x = -999;
    mouse.y = -999;
  });

  window.addEventListener('resize', function () {
    resize();
    while (particles.length < PARTICLE_COUNT) particles.push(new Particle());
    while (particles.length > PARTICLE_COUNT) particles.pop();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      animate();
    });
  } else {
    init();
    animate();
  }
})();
