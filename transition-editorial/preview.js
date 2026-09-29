if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -35px 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

if (window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor hidden';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  document.body.classList.add('has-cursor');
  document.addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.remove('hidden');
    cursor.classList.toggle('is-link', Boolean(event.target.closest('a,button')));
  });
  document.addEventListener('pointerleave', () => cursor.classList.add('hidden'));
}

for (const select of document.querySelectorAll('[data-workflow-select]')) {
  select.addEventListener('change', () => {
    const picker = select.closest('.workflow-picker');
    for (const panel of picker.querySelectorAll('[data-workflow-panel]')) {
      panel.hidden = panel.dataset.workflowPanel !== select.value;
    }
  });
}

for (const frame of document.querySelectorAll('[data-eval-frame]')) {
  frame.addEventListener('load', () => {
    const doc = frame.contentDocument;
    if (!doc) return;
    const resize = () => { frame.style.height = `${doc.documentElement.scrollHeight + 2}px`; };
    resize();
    new ResizeObserver(resize).observe(doc.body);
    window.addEventListener('resize', resize);
  });
}
