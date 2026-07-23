const defaultDialogue = "Hello! I'm Fluffy. Welcome to my character profile. Select a destination to begin.";

const dialogueBox = document.getElementById('dialogue');
const menuCards = document.querySelectorAll('.menuCard');
const previewOverlay = document.getElementById('mobilePreviewOverlay');
const previewTitle = document.getElementById('mobilePreviewTitle');
const previewText = document.getElementById('mobilePreviewText');
const previewButton = document.getElementById('mobilePreviewButton');
let touchStartX = 0;
let touchStartY = 0;
let activePreviewUrl = '';

function setDialogue(text) {
  if (dialogueBox) {
    dialogueBox.textContent = text;
  }
}

function resetDialogue() {
  setDialogue(defaultDialogue);
}

function openPreviewPanel(message, url) {
  if (!previewOverlay || !previewTitle || !previewText || !previewButton) return;

  previewTitle.textContent = 'ARE YOU READY?';
  previewText.textContent = message;
  activePreviewUrl = url || '';
  previewButton.dataset.href = activePreviewUrl;
  previewOverlay.classList.add('is-open');
  previewOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('mobile-preview-open');
}

function closePreviewPanel() {
  if (!previewOverlay) return;

  previewOverlay.classList.remove('is-open');
  previewOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('mobile-preview-open');
}

previewOverlay?.addEventListener('click', (event) => {
  if (event.target === previewOverlay) {
    closePreviewPanel();
  }
});

previewButton?.addEventListener('click', () => {
  if (activePreviewUrl && activePreviewUrl !== '#') {
    window.open(activePreviewUrl, '_blank', 'noopener,noreferrer');
  }
  closePreviewPanel();
});

menuCards.forEach((card) => {
  const previewMessage = card.getAttribute('data-dialogue') || card.querySelector('p')?.textContent || '';
  const cardUrl = card.getAttribute('data-url') || card.getAttribute('href') || '#';

  card.addEventListener('mouseenter', () => setDialogue(previewMessage));
  card.addEventListener('focus', () => setDialogue(previewMessage));
  card.addEventListener('mouseleave', resetDialogue);
  card.addEventListener('blur', resetDialogue);

  card.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  card.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (window.matchMedia('(hover: none)').matches && deltaX > 70 && Math.abs(deltaY) < 60) {
      event.preventDefault();
      openPreviewPanel(previewMessage, cardUrl);
    }
  }, { passive: false });

  card.addEventListener('click', (event) => {
    if (window.matchMedia('(hover: none)').matches) {
      event.preventDefault();
      openPreviewPanel(previewMessage, cardUrl);
    }
  });
});
