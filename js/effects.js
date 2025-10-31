document.addEventListener("DOMContentLoaded", () => {
  const starfield = document.querySelector('.starfield');
  const numberOfStars = 150;

  const colors = ['#ffffff', '#00ffff', '#ff66ff', '#99ccff', '#cc99ff'];

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    const size = Math.random() < 0.85 ? 2 : 3;
    const duration = 10 + Math.random() * 20;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const color = colors[Math.floor(Math.random() * colors.length)];

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${top}vh`;
    star.style.left = `${left}vw`;
    star.style.animationDuration = `${duration}s`;
    star.style.backgroundColor = color;
    star.style.boxShadow = `0 0 6px ${color}, 0 0 12px ${color}`;

    starfield.appendChild(star);
  }
});
