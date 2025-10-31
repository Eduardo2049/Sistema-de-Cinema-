function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

function renderFilmsList(container){
  const films = window.FilmesAPI.list();
  container.innerHTML = '';
  if(films.length === 0){
    container.textContent = 'Nenhum filme cadastrado.';
    return;
  }
  const ul = document.createElement('ul');
  ul.className = 'list-group';
  films.forEach((f, i) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    
    const filmInfo = document.createElement('div');
    filmInfo.className = 'd-flex justify-content-between align-items-start';
    
    const details = document.createElement('div');
    details.className = 'flex-grow-1';
    details.innerHTML = `
      <h6 class="mb-1"><strong>${escapeHtml(f.title)}</strong></h6>
      <p class="mb-1 small">${escapeHtml(f.description || 'Sem descrição')}</p>
      <div class="small text-muted">
        <span class="badge bg-secondary me-1">${escapeHtml(f.genre || 'N/A')}</span>
        <span class="badge bg-info me-1">Classificação: ${escapeHtml(f.rating || 'N/A')}</span>
        <span class="badge bg-dark me-1">${escapeHtml(f.duration || 'N/A')} min</span>
        <span class="badge bg-primary">Estreia: ${escapeHtml(f.releaseDate || 'N/A')}</span>
      </div>
    `;
    
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-danger ms-2';
    btn.textContent = 'Remover';
    btn.addEventListener('click', () => {
      if(confirm(`Deseja realmente remover o filme "${f.title}"?`)) {
        window.FilmesAPI.remove(i);
        renderFilmsList(container);
      }
    });
    
    filmInfo.appendChild(details);
    filmInfo.appendChild(btn);
    li.appendChild(filmInfo);
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function bindFilmForm(form, container){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const film = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      genre: form.genre.value,
      rating: form.rating.value,
      duration: form.duration.value,
      releaseDate: form.releaseDate.value
    };
    if(!film.title || !film.description || !film.genre || !film.rating || !film.duration || !film.releaseDate) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    window.FilmesAPI.add(film);
    form.reset();
    renderFilmsList(container);
    alert('Filme cadastrado com sucesso!');
  });
}