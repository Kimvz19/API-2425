// import styling page
import './index.css';

// checken of de js bestand werkt
console.log('index.js is working');


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.grid a').forEach(link => {
      link.addEventListener('click', (event) => {
        if (!document.startViewTransition) return;
  
        event.preventDefault();
        const href = link.href;
  
        document.startViewTransition(() => {
          window.location.href = href;
        });
      });
    });
  });
  
  