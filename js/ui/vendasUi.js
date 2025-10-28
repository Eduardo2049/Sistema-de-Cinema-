function renderVendasList(container){
  const data = window.VendasAPI.list();
  container.innerHTML = '';
  if(!data.length){ container.textContent = 'Nenhuma venda.'; return; }
  const ul = document.createElement('ul'); ul.className='list-group';
  data.forEach((v)=>{
    const li=document.createElement('li'); li.className='list-group-item';
    li.textContent = `Sessão ${v.sessionId} — Assentos: ${v.seats.join(', ')} — R$ ${v.total.toFixed(2)}`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}
function bindVendaForm(form, container){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const sale = { sessionId: form.sessionId.value, seats: (form.seats.value||'').split(',').map(s=>s.trim()).filter(Boolean), total: Number(form.total.value) || 0 };
    window.VendasAPI.add(sale);
    form.reset();
    renderVendasList(container);
  });
}