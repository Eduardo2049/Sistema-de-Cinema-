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
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `<div><strong>${escapeHtml(f.title)}</strong> <small class="text-muted">(${escapeHtml(f.year || 'n/a')})</small></div>`;
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-danger';
    btn.textContent = 'Remover';
    btn.addEventListener('click', () => {
      window.FilmesAPI.remove(i);
      renderFilmsList(container);
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function bindFilmForm(form, container){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const film = {
      title: form.title.value.trim(),
      year: form.year.value.trim()
    };
    if(!film.title) return;
    window.FilmesAPI.add(film);
    form.reset();
    renderFilmsList(container);
  });
}