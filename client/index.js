// import styling page
import './index.css';

// checken of de js bestand werkt
console.log('index.js is working');

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM is volledig geladen");

  const mainImage = document.getElementById("mainImage");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");

  mainImage.addEventListener("click", () => {
    console.log("🖼️ Klik op mainImage gedetecteerd");

    if (!document.startViewTransition) {
      console.warn("⚠️ startViewTransition niet ondersteund - fallback modus actief");
      lightboxImage.innerHTML = "";
      const clone = mainImage.cloneNode();
      clone.style.viewTransitionName = "mainImage";
      lightboxImage.appendChild(clone);
      lightbox.classList.add("show-lightbox");
      console.log("🧩 Lightbox geopend zonder view transition");
      return;
    }

    console.log("🚀 View transition wordt gestart...");
    document.startViewTransition(() => {
      lightboxImage.innerHTML = "";
      const clone = mainImage.cloneNode();
      clone.style.viewTransitionName = "mainImage";
      lightboxImage.appendChild(clone);
      lightbox.classList.add("show-lightbox");
      console.log("✅ Lightbox geopend met view transition");
    });
  });

  lightbox.addEventListener("click", () => {
    console.log("❌ Klik op lightbox (sluiten)");

    if (!document.startViewTransition) {
      lightbox.classList.remove("show-lightbox");
      console.log("🧩 Lightbox gesloten zonder view transition");
      return;
    }

    console.log("🚪 View transition sluiting gestart...");
    document.startViewTransition(() => {
      lightbox.classList.remove("show-lightbox");
      console.log("✅ Lightbox gesloten met view transition");
    });
  });
});



// document.addEventListener('DOMContentLoaded', () => {
//   console.log('startViewTransition beschikbaar:', typeof document.startViewTransition === 'function');

//   document.querySelectorAll('.layout-animals a').forEach(link => {
//     link.addEventListener('click', (event) => {
//       if (!document.startViewTransition) {
//         console.warn('View Transition API wordt niet ondersteund');
//         return;
//       }

//       event.preventDefault();
//       const href = link.href;

//       console.log('Start view transition naar:', href);

//       const transition = document.startViewTransition(() => {
//         window.location.href = href;
//       });

//       // Optioneel: loggen wanneer de overgang voltooid is
//       transition.finished.then(() => {
//         console.log('✅ View transition voltooid!');
//       }).catch(err => {
//         console.error('❌ View transition fout:', err);
//       });
//     });
//   });
// });



  