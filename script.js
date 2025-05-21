document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('themeSelector');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (selector) {
    selector.value = savedTheme;
    selector.addEventListener('change', (e) => {
      const newTheme = e.target.value;
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  const invisibleInkNotes = new Set(JSON.parse(localStorage.getItem('invisibleInkNotes') || '[]'));
  const lockedNotes = new Set(JSON.parse(localStorage.getItem('lockedNotes') || '[]'));
  const pins = new Set(JSON.parse(localStorage.getItem('pinnedNotes') || '[]'));
  const focusToggle = document.getElementById('focusToggle');
  const notesList = document.getElementById('notesList');
  let focusMode = false;

  document.querySelectorAll('li').forEach(li => {
    const id = li.querySelector('.invisibleToggle')?.dataset.id;

    if (id && invisibleInkNotes.has(id)) {
      li.querySelector('a').classList.add('invisible-ink');
      const icon = li.querySelector('.invisibleToggle i');
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }

    if (id && lockedNotes.has(id)) {
      li.classList.add('locked-note');
      const icon = li.querySelector('.lock-btn i');
      icon.classList.remove('fa-lock-open');
      icon.classList.add('fa-lock');

      // Hide note title, save original title in data attribute if not saved yet
      const link = li.querySelector('a');
      if (!li.dataset.title) {
        li.dataset.title = link.textContent;
      }
      link.textContent = 'Locked Note';
    }

    if (id && pins.has(id)) {
      const pinBtn = li.querySelector('.pin-btn');
      if (pinBtn) pinBtn.classList.add('pinned');
    }
  });

  document.querySelectorAll('.invisibleToggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const link = btn.parentElement.querySelector('a');
      const icon = btn.querySelector('i');

      if (invisibleInkNotes.has(id)) {
        invisibleInkNotes.delete(id);
        link.classList.remove('invisible-ink');
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      } else {
        invisibleInkNotes.add(id);
        link.classList.add('invisible-ink');
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
      localStorage.setItem('invisibleInkNotes', JSON.stringify([...invisibleInkNotes]));
    });
  });

  if (notesList) {
    notesList.addEventListener('click', (e) => {
      if (e.target.classList.contains('pin-btn') || e.target.closest('.pin-btn')) {
        const btn = e.target.closest('.pin-btn');
        const id = btn.dataset.id;
        if (pins.has(id)) {
          pins.delete(id);
          btn.classList.remove('pinned');
        } else {
          pins.add(id);
          btn.classList.add('pinned');
        }
        localStorage.setItem('pinnedNotes', JSON.stringify([...pins]));

        if (focusMode) {
          toggleFocusMode(focusMode);
        }
      }

      if (e.target.classList.contains('lock-btn') || e.target.closest('.lock-btn')) {
        const btn = e.target.closest('.lock-btn');
        const id = btn.dataset.id;
        const li = btn.parentElement;
        const link = li.querySelector('a');

        if (lockedNotes.has(id)) {
          const pass = prompt('Enter password to unlock this note:');
          if (pass === '1234') {  // Replace with your password or logic
            lockedNotes.delete(id);
            li.classList.remove('locked-note');
            btn.querySelector('i').classList.remove('fa-lock');
            btn.querySelector('i').classList.add('fa-lock-open');

            // Reveal note title
            if (li.dataset.title) {
              link.textContent = li.dataset.title;
            }
          } else {
            alert('Incorrect password!');
          }
        } else {
          lockedNotes.add(id);
          li.classList.add('locked-note');
          btn.querySelector('i').classList.remove('fa-lock-open');
          btn.querySelector('i').classList.add('fa-lock');

          // Hide note title, save original title
          if (!li.dataset.title) {
            li.dataset.title = link.textContent;
          }
          link.textContent = 'Locked Note';
        }
        localStorage.setItem('lockedNotes', JSON.stringify([...lockedNotes]));
      }
    });
  }

  if (focusToggle) {
    focusToggle.addEventListener('click', () => {
      focusMode = !focusMode;
      focusToggle.textContent = `Focus Mode: ${focusMode ? 'On' : 'Off'}`;
      toggleFocusMode(focusMode);
    });
  }

  function toggleFocusMode(on) {
    document.querySelectorAll('#notesList li').forEach(li => {
      const pinBtn = li.querySelector('.pin-btn');
      const id = pinBtn?.dataset.id;
      if (on && !pins.has(id)) {
        li.style.display = 'none';
      } else {
        li.style.display = '';
      }
    });
  }
});