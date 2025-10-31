function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

function renderSalasList(container){
  const data = window.SalasAPI.list();
  container.innerHTML = '';
  if(!data.length){ container.textContent = 'Nenhuma sala cadastrada.'; return; }
  const ul = document.createElement('ul'); ul.className='list-group';
  data.forEach((r,i)=>{
    const li=document.createElement('li'); li.className='list-group-item';
    
    const salaInfo = document.createElement('div');
    salaInfo.className = 'd-flex justify-content-between align-items-center';
    
    const details = document.createElement('div');
    details.innerHTML = `
      <h6 class="mb-1"><strong>Sala ${escapeHtml(r.name)}</strong></h6>
      <div class="small text-muted">
        <span class="badge bg-primary me-1">Capacidade: ${escapeHtml(r.capacity)} lugares</span>
        <span class="badge bg-secondary">Tipo: ${escapeHtml(r.type || 'N/A')}</span>
      </div>
    `;
    
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-danger';
    btn.textContent = 'Remover';
    btn.addEventListener('click', () => {
      if(confirm(`Deseja realmente remover a Sala ${r.name}?`)) {
        window.SalasAPI.remove(i);
        renderSalasList(container);
      }
    });
    
    salaInfo.appendChild(details);
    salaInfo.appendChild(btn);
    li.appendChild(salaInfo);
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function bindSalaForm(form, container){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const room = { 
      name: form.name.value.trim(), 
      capacity: Number(form.capacity.value) || 0,
      type: form.type.value
    };
    if(!room.name || !room.capacity || !room.type) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    window.SalasAPI.add(room);
    form.reset();
    renderSalasList(container);
    alert('Sala cadastrada com sucesso!');
  });
}