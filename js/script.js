const decks = {
  selected: [
    {
      title: "WhatsApp Direto",
      image: "assets/xhakinha-1.jpg",
      icon: "💬",
      type: "link",
      href: "https://wa.me/5500000000000",
      preview: "Fala comigo no WhatsApp agora mesmo.",
    },
    {
      title: "Instagram",
      image: "assets/xhakinha-2.jpg",
      icon: "📸",
      type: "link",
      href: "https://instagram.com/",
      preview: "Os cortes mais pesados e bastidores.",
    },
    {
      title: "Agenda & Shows",
      image: "assets/xhakinha-3.jpg",
      icon: "📅",
      type: "link",
      href: "https://example.com/agenda",
      preview: "Datas, locais e novidades fresquinhas.",
    },
    {
      title: "YouTube",
      image: "assets/xhakinha-4.jpg",
      icon: "▶️",
      type: "link",
      href: "https://youtube.com/",
      preview: "Clipes e quadros completos no canal.",
    },
  ],
  content: [
    {
      title: "Por trás do rolê",
      image: "assets/xhakinha-5.jpg",
      icon: "🎬",
      type: "modal",
      body: "Momento exclusivo com o Xhakinha. Ajuste o texto depois.",
    },
    {
      title: "Estouro na resenha",
      image: "assets/xhakinha-6.jpg",
      icon: "🔥",
      type: "modal",
      body: "Cortes inéditos e energia máxima. Troque o conteúdo quando quiser.",
    },
    {
      title: "Studio vibe",
      image: "assets/xhakinha-7.jpg",
      icon: "🎧",
      type: "modal",
      body: "Backstage do som novo. Atualize com vídeos ou fotos.",
    },
  ],
  foryou: [
    {
      title: "Desafio do dia",
      image: "assets/xhakinha-8.jpg",
      icon: "😈",
      type: "link",
      href: "https://example.com/desafio",
      preview: "Topa esse desafio? Clica e confere.",
    },
    {
      title: "Lista secreta",
      image: "assets/xhakinha-9.jpg",
      icon: "✨",
      type: "link",
      href: "https://example.com/secreto",
      preview: "Só pra quem é fiel de verdade.",
    },
  ],
};

const slogans = [
  "ta gravando?",
  "errado família",
  "vamo de velha",
  "já que ninguém pediu",
  "curte comenta e denuncia",
  "mc xerox na voz",
  "certo?",
  "vamos de menus uma",
  "já explodi essa dai",
  "3 pila né",
  "um chopp né",
  "gelicoco",
  "tu sabe fazer? OOOOOOOHH",
  "eu sou do funk tlgd",
  "Alarguei o anel no dedo",
  "vai tomanu do bombeiro",
  "vai tomando da tropa do sedex",
  "Botou ciclone",
];

const deckEl = document.querySelector(".deck");
const previewTitle = document.querySelector(".preview__title");
const previewDescription = document.querySelector(".preview__description");
const previewMedia = document.querySelector(".preview__media");
const previewCta = document.querySelector(".preview__cta");
const tabs = document.querySelectorAll(".tab");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal__title");
const modalBody = document.querySelector(".modal__body");
const modalMedia = document.querySelector(".modal__media");
const modalClose = document.querySelector(".modal__close");
const modalBackdrop = document.querySelector(".modal__backdrop");
const pattern = document.querySelector(".background__pattern");

let activeTab = "selected";
let deckData = [...decks[activeTab]];
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let dragOffset = { x: 0, y: 0 };

const buildPattern = () => {
  pattern.innerHTML = "";
  const count = 28;
  for (let i = 0; i < count; i += 1) {
    const span = document.createElement("span");
    span.textContent = slogans[i % slogans.length];
    span.style.setProperty("--r", (Math.random() * 2 - 1).toFixed(2));
    pattern.append(span);
  }
};

const updatePreview = (card) => {
  if (!card) return;
  previewTitle.textContent = card.title;
  previewDescription.textContent = card.preview || card.body || "Escolha esse card para abrir.";
  previewMedia.style.backgroundImage = `url("${card.image}")`;
  previewCta.onclick = () => handleCardAction(card);
};

const positionCards = () => {
  const cards = deckEl.querySelectorAll(".card");
  cards.forEach((card, index) => {
    const depth = Math.min(index, 3);
    const scale = 1 - depth * 0.05;
    const translateY = depth * 14;
    const rotateX = depth * -2;
    card.style.transform = `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`;
    card.style.zIndex = String(100 - index);
    card.style.opacity = depth > 4 ? 0 : 1;
  });
};

const renderDeck = () => {
  deckEl.innerHTML = "";
  deckData.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.index = String(index);

    const media = document.createElement("div");
    media.className = "card__media";
    media.style.backgroundImage = `url("${item.image}")`;
    media.setAttribute("loading", "lazy");

    const body = document.createElement("div");
    body.className = "card__body";

    const title = document.createElement("h3");
    title.className = "card__title";
    title.textContent = item.title;

    const icon = document.createElement("div");
    icon.className = "card__icon";
    icon.textContent = item.icon;

    body.append(title, icon);
    card.append(media, body);

    if (index === 0) {
      attachDrag(card);
      card.addEventListener("click", () => {
        if (!isDragging) handleCardAction(item);
      });
    }

    deckEl.append(card);
  });
  positionCards();
  updatePreview(deckData[0]);
};

const handleCardAction = (card) => {
  if (card.type === "link" && card.href) {
    window.open(card.href, "_blank", "noopener,noreferrer");
  }

  if (card.type === "modal") {
    modalTitle.textContent = card.title;
    modalBody.textContent = card.body || "";
    modalMedia.style.backgroundImage = `url("${card.image}")`;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

const attachDrag = (card) => {
  const handlePointerMove = (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    dragOffset = { x: deltaX, y: deltaY };
    const rotate = deltaX * 0.08;
    card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    const threshold = 120;
    const shouldDismiss = Math.abs(dragOffset.x) > threshold || Math.abs(dragOffset.y) > threshold;

    if (shouldDismiss) {
      const exitX = dragOffset.x > 0 ? 600 : -600;
      const exitY = dragOffset.y > 0 ? 260 : -260;
      card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
      card.style.transform = `translate(${exitX}px, ${exitY}px) rotate(${exitX * 0.05}deg)`;
      card.style.opacity = "0";

      setTimeout(() => {
        deckData.push(deckData.shift());
        renderDeck();
      }, 260);
    } else {
      card.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      positionCards();
    }

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  card.addEventListener("pointerdown", (event) => {
    isDragging = true;
    dragStart = { x: event.clientX, y: event.clientY };
    dragOffset = { x: 0, y: 0 };
    card.setPointerCapture(event.pointerId);
    card.style.transition = "none";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  });
};

const switchTab = (tab) => {
  activeTab = tab;
  deckData = [...decks[activeTab]];
  tabs.forEach((button) => {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  renderDeck();
};

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

tabs.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

buildPattern();
renderDeck();
