// import styling page
import './index.css';

// checken of de js bestand werkt
console.log('index.js is working');

document.addEventListener('DOMContentLoaded', () => {
  console.log('startViewTransition beschikbaar:', typeof document.startViewTransition === 'function');

  document.querySelectorAll('.layout-animals a').forEach(link => {
    link.addEventListener('click', (event) => {
      if (!document.startViewTransition) {
        console.warn('View Transition API wordt niet ondersteund');
        return;
      }

      event.preventDefault();
      const href = link.href;

      console.log('Start view transition naar:', href);

      const transition = document.startViewTransition(() => {
        window.location.href = href;
      });

      // Optioneel: loggen wanneer de overgang voltooid is
      transition.finished.then(() => {
        console.log('✅ View transition voltooid!');
      }).catch(err => {
        console.error('❌ View transition fout:', err);
      });
    });
  });
});



  