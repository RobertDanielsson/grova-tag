document.getElementById('year').textContent = new Date().getFullYear();

// Respect reduced motion: no looping hero footage
if (matchMedia('(prefers-reduced-motion: reduce)').matches) { const v = document.querySelector('.hero-media'); v?.removeAttribute('autoplay'); v?.pause(); }

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

// Contact form → Web3Forms emails it to us. If that fails, open the visitor's mail app with the message filled in.
const form = document.querySelector('#offert');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const subject = 'Offertförfrågan – ' + d.get('jobb');
  d.set('subject', subject);
  const status = form.querySelector('.note');
  const btn = form.querySelector('button');
  btn.disabled = true;
  status.textContent = 'Skickar…';
  try {
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: d, headers: { Accept: 'application/json' } });
    if (!(await res.json()).success) throw new Error('rejected');
    form.reset();
    status.textContent = 'Tack! Vi har fått din förfrågan och hör av oss snart.';
  } catch {
    status.textContent = `Det gick inte att skicka härifrån. Ring 079-104 44 93 eller mejla ${form.dataset.to}.`;
    const body = `Namn: ${d.get('namn')}\nTelefon: ${d.get('telefon')}\nOrt: ${d.get('ort')}\nTyp av jobb: ${d.get('jobb')}\n\n${d.get('meddelande')}`;
    location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  } finally {
    btn.disabled = false;
  }
});
