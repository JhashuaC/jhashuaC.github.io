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

document.querySelectorAll('.fade-section').forEach(section => {
  section.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-1000');
  observer.observe(section);
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
