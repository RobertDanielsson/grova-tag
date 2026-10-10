document.getElementById('year').textContent = new Date().getFullYear();

// Fade sections in as they scroll into view
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Gallery category filter
const filters = document.querySelector('.filters');
filters?.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  filters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === btn));
  const cat = btn.dataset.cat;
  document.querySelectorAll('.gallery figure').forEach((f) => {
    f.hidden = cat !== 'alla' && f.dataset.cat !== cat;
  });
});

// Click a photo to view it large
const box = document.querySelector('.lightbox');
document.querySelector('.gallery')?.addEventListener('click', (e) => {
  const img = e.target.closest('img');
  if (!img) return;
  box.querySelector('img').src = img.src;
  box.querySelector('img').alt = img.alt;
  box.showModal();
});
box?.addEventListener('click', () => box.close());

// Contact form → opens the visitor's mail app with the message filled in.
// shortcut: needs a mail app on the visitor's device, swap for Formspree or a backend if submissions should arrive without one
const form = document.querySelector('#offert');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const body = `Namn: ${d.get('namn')}\nTelefon: ${d.get('telefon')}\nOrt: ${d.get('ort')}\nTyp av jobb: ${d.get('jobb')}\n\n${d.get('meddelande')}`;
  location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent('Offertförfrågan – ' + d.get('jobb'))}&body=${encodeURIComponent(body)}`;
});
