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

const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');

    // Botón activo visualmente
    filterButtons.forEach(btn => btn.classList.remove('bg-teal-400', 'text-gray-900'));
    button.classList.add('bg-teal-400', 'text-gray-900');

    // Filtrado animado
    projectItems.forEach(item => {
      const match = item.classList.contains(`category-${filter}`);

      if (filter === 'all' || match) {
        item.classList.remove('opacity-0', 'scale-95', 'hidden');
        item.classList.add('opacity-100', 'scale-100');
      } else {
        item.classList.remove('opacity-100', 'scale-100');
        item.classList.add('opacity-0', 'scale-95');
        setTimeout(() => item.classList.add('hidden'), 300);
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const skillSection = document.querySelector('#skills');

  if (skillSection) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar').forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    skillObserver.observe(skillSection);
  }
});
// Timeline slide-in animation
document.addEventListener('DOMContentLoaded', () => {
  const timelineEntries = document.querySelectorAll('.timeline-entry');
  const timelineObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-x-10');
        entry.target.classList.add('opacity-100', 'translate-x-0');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  timelineEntries.forEach(entry => {
    timelineObserver.observe(entry);
  });
});
