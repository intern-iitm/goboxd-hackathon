document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('pre').forEach(function (pre) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copy';
    pre.appendChild(btn);
    btn.addEventListener('click', function () {
      var code = pre.querySelector('code');
      var text = code ? code.textContent : pre.textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1600);
      });
    });
  });

  // Confetti burst for the winners podium
  var canvas = document.querySelector('.confetti-canvas');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var section = canvas.closest('.section-winners');
    var colors = ['#FFD86B', '#CC785C', '#F0EDE5', '#B8860B', '#E8C07D'];
    var pieces = [];
    var running = false;
    var rafId = null;

    function size() {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    }

    function burst() {
      size();
      pieces = [];
      var count = Math.min(160, Math.round(canvas.width / 8));
      for (var i = 0; i < count; i++) {
        pieces.push({
          x: Math.random() * canvas.width,
          y: -20 - Math.random() * canvas.height * 0.5,
          w: 6 + Math.random() * 6,
          h: 8 + Math.random() * 8,
          color: colors[i % colors.length],
          vx: (Math.random() - 0.5) * 1.6,
          vy: 2 + Math.random() * 3.5,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.25,
          life: 0,
          ttl: 140 + Math.random() * 80
        });
      }
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = 0;
      for (var i = 0; i < pieces.length; i++) {
        var p = pieces[i];
        p.life++;
        if (p.life > p.ttl) continue;
        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.ttl);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive > 0) {
        rafId = requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    var fired = false;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !fired) {
            fired = true;
            burst();
            setTimeout(burst, 700);
          }
        });
      }, { threshold: 0.35 });
      io.observe(section);
    } else {
      burst();
    }

    window.addEventListener('resize', function () {
      if (running) size();
    });
  }
});
