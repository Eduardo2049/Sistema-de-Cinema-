function renderSalasList(container){
  const data = window.SalasAPI.list();
  container.innerHTML = '';
  if(!data.length){ container.textContent = 'Nenhuma sala.'; return; }
  const ul = document.createElement('ul'); ul.className='list-group';
  data.forEach((r,i)=>{
    const li=document.createElement('li'); li.className='list-group-item';
    li.textContent = `Sala ${r.name} — Capacidade: ${r.capacity}`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}
function bindSalaForm(form, container){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const room = { name: form.name.value.trim(), capacity: Number(form.capacity.value) || 0 };
    if(!room.name) return;
    window.SalasAPI.add(room);
    form.reset();
    renderSalasList(container);
  });
}