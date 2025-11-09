// Simple interactive 3-branch clients visualization
(function(){
  const container = document.querySelector('.clients-graph');
  if (!container) return;
  // Add subtle pulsing animation
  container.querySelectorAll('.client-node').forEach(node=>{
    node.addEventListener('mouseenter', ()=> node.classList.add('hover'));
    node.addEventListener('mouseleave', ()=> node.classList.remove('hover'));
  });
})();
