// script.js

// Animar sección al hacer scroll (fade in)
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

// Hover magnético para botones
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });

  btn.addEventListener('mouseleave', function() {
    btn.style.transform = 'translate(0, 0)';
  });
});



// Typewriter animation
document.addEventListener('DOMContentLoaded', () => {
  const roles = ['Cybersecurity Enthusiast', 'Backend Developer', 'IoT Hacker', 'REST API Developer'];
  let i = 0, j = 0, isDeleting = false;
  const el = document.getElementById('typewriter');
  let current = '';

  function typeLoop() {
    current = roles[i];
    if (!isDeleting) {
      el.textContent = current.slice(0, j++);
      if (j > current.length + 10) isDeleting = true;
    } else {
      el.textContent = current.slice(0, j--);
      if (j === 0) {
        isDeleting = false;
        i = (i + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 60 : 100);
  }

  typeLoop();
});
