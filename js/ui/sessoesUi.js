function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

function renderSessoesList(container){
  const data = window.SessoesAPI.list();
  container.innerHTML = '';
  if(!data.length){ container.textContent = 'Nenhuma sessão cadastrada.'; return; }
  const ul = document.createElement('ul'); ul.className='list-group';
  data.forEach((s,i)=>{
    const li=document.createElement('li'); li.className='list-group-item';
    
    const sessaoInfo = document.createElement('div');
    sessaoInfo.className = 'd-flex justify-content-between align-items-start';
    
    const details = document.createElement('div');
    details.className = 'flex-grow-1';
    details.innerHTML = `
      <h6 class="mb-1"><strong>${escapeHtml(s.movieTitle || 'Filme desconhecido')}</strong></h6>
      <p class="mb-1 small">Sala: ${escapeHtml(s.roomName || s.roomId || 'N/A')}</p>
      <div class="small text-muted">
        <span class="badge bg-primary me-1">📅 ${escapeHtml(s.datetime || 'N/A')}</span>
        <span class="badge bg-success me-1">💰 R$ ${escapeHtml(s.price || '0.00')}</span>
        <span class="badge bg-info me-1">${escapeHtml(s.language || 'N/A')}</span>
        <span class="badge bg-secondary">${escapeHtml(s.format || 'N/A')}</span>
      </div>
    `;
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'd-flex flex-column gap-1 ms-2';
    
    const buyBtn = document.createElement('a');
    buyBtn.className = 'btn btn-sm btn-primary';
    buyBtn.textContent = 'Comprar Ingresso';
    buyBtn.href = `/pages/vendas.html?sessao=${i}`;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-sm btn-danger';
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => {
      if(confirm(`Deseja realmente remover esta sessão?`)) {
        window.SessoesAPI.remove(i);
        renderSessoesList(container);
      }
    });
    
    btnGroup.appendChild(buyBtn);
    btnGroup.appendChild(removeBtn);
    
    sessaoInfo.appendChild(details);
    sessaoInfo.appendChild(btnGroup);
    li.appendChild(sessaoInfo);
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function bindSessaoForm(form, container){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    
    const movieId = form.movieId.value;
    const roomId = form.roomId.value;
    const films = window.FilmesAPI.list();
    const rooms = window.SalasAPI.list();
    
    const movieTitle = (films[movieId] && films[movieId].title) ? films[movieId].title : '';
    const roomName = (rooms[roomId] && rooms[roomId].name) ? rooms[roomId].name : '';
    
    const sess = { 
      movieId: movieId, 
      movieTitle: movieTitle,
      roomId: roomId,
      roomName: roomName,
      datetime: form.datetime.value,
      price: form.price.value,
      language: form.language.value,
      format: form.format.value
    };
    
    if(!sess.movieId || !sess.roomId || !sess.datetime || !sess.price || !sess.language || !sess.format) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    window.SessoesAPI.add(sess);
    form.reset();
    renderSessoesList(container);
    alert('Sessão cadastrada com sucesso!');
  });
}

function populateMovieSelect(selectEl){
  if(!selectEl) return;
  if(!window.FilmesAPI || typeof window.FilmesAPI.list !== 'function') return;
  const films = window.FilmesAPI.list();
  selectEl.innerHTML = '<option value="" disabled selected>Selecione um filme</option>';
  films.forEach((f, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = f.title + (f.genre ? ` - ${f.genre}` : '') + (f.duration ? ` (${f.duration} min)` : '');
    selectEl.appendChild(opt);
  });
}

function populateRoomSelect(selectEl){
  if(!selectEl) return;
  if(!window.SalasAPI || typeof window.SalasAPI.list !== 'function') return;
  const rooms = window.SalasAPI.list();
  selectEl.innerHTML = '<option value="" disabled selected>Selecione uma sala</option>';
  rooms.forEach((r, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Sala ${r.name} - ${r.type} (${r.capacity} lugares)`;
    selectEl.appendChild(opt);
  });
}