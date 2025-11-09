// Simple rotation for circular carousel on desktop
(function(){
  const ring = document.getElementById('banwanaRing');
  if (!ring) return;
  let angle = 0;
  let autoRotate = true;
  const rotateStep = 45; // degrees per tick
  function tick(){
    if (autoRotate){
      angle = (angle + rotateStep) % 360;
      ring.style.transform = `rotateY(${angle}deg)`;
    }
  }
  let interval = setInterval(tick, 3000);

  // Pause on hover / touch
  ring.addEventListener('mouseenter', ()=> autoRotate = false);
  ring.addEventListener('mouseleave', ()=> autoRotate = true);
  ring.addEventListener('touchstart', ()=> autoRotate = false);
  ring.addEventListener('touchend', ()=> autoRotate = true);

  // Make carousel accessible: keyboard arrows
  ring.setAttribute('tabindex', '0');
  ring.addEventListener('keydown', e=>{
    if (e.key === 'ArrowLeft') { angle = angle - rotateStep; ring.style.transform = `rotateY(${angle}deg)`; }
    if (e.key === 'ArrowRight') { angle = angle + rotateStep; ring.style.transform = `rotateY(${angle}deg)`; }
  });
})();
