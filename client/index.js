// import styling page
import './index.css';

// controle of js werkt
console.log('index.js is working');


// made code with claude : https://claude.ai/public/artifacts/f86c9bba-b32d-4774-ae11-235597e65f33 //
// view transitions api
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM is fully loaded");

  const mainImage = document.getElementById("mainImage");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");

  // Only proceed if elements are found
  if (!mainImage || !lightbox || !lightboxImage) {
    console.error("❌ Required elements not found!");
    return;
  }

  // Function to handle opening the lightbox
  function openLightbox() {
    console.log("🖼️ Click on mainImage detected");

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      console.warn("⚠️ startViewTransition not supported - fallback mode active");
      lightboxImage.innerHTML = "";
      const clone = mainImage.cloneNode(true); // Use true to clone children too
      lightboxImage.appendChild(clone);
      lightbox.classList.add("show-lightbox");
      console.log("🧩 Lightbox opened without view transition");
      return;
    }

    // Use View Transitions API
    console.log("🚀 Starting view transition...");
    document.startViewTransition(() => {
      lightboxImage.innerHTML = "";
      const clone = mainImage.cloneNode(true);
      // Don't set style here, use CSS instead
      lightboxImage.appendChild(clone);
      lightbox.classList.add("show-lightbox");
      document.documentElement.classList.add('lightbox-open');
      console.log("✅ Lightbox opened with view transition");
    });
  }

  // Function to handle closing the lightbox
  function closeLightbox() {
    console.log("❌ Click on lightbox (closing)");

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      lightbox.classList.remove("show-lightbox");
      document.documentElement.classList.remove('lightbox-open');
      console.log("🧩 Lightbox closed without view transition");
      return;
    }

    // Use View Transitions API
    console.log("🚪 Starting view transition for closing...");
    document.startViewTransition(() => {
      lightbox.classList.remove("show-lightbox");
      document.documentElement.classList.remove('lightbox-open');
      console.log("✅ Lightbox closed with view transition");
    });
  }

  // Add click events
  mainImage.addEventListener("click", openLightbox);
  lightbox.addEventListener("click", closeLightbox);

  // Polyfill for browsers that don't support View Transitions API
  if (!document.startViewTransition) {
    console.log("ℹ️ Adding basic transition fallback");
    
    // Add some basic CSS transitions as fallback
    const style = document.createElement('style');
    style.textContent = `
      .lightbox {
        transition: opacity .1s ease;
        opacity: 0;
      }
      .show-lightbox {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }
});