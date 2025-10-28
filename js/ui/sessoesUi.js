function renderSessoesList(container){
  const data = window.SessoesAPI.list();
  container.innerHTML = '';
  if(!data.length){ container.textContent = 'Nenhuma sessão.'; return; }
  const ul = document.createElement('ul'); ul.className='list-group';
  data.forEach((s,i)=>{
    const li=document.createElement('li'); li.className='list-group-item';
    li.textContent = `${s.movieTitle} — ${s.date} ${s.time} (Sala ${s.roomId})`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}
function bindSessaoForm(form, container){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const sess = { movieId: form.movieId.value, movieTitle: form.movieTitle.value, roomId: form.roomId.value, date: form.date.value, time: form.time.value };
    window.SessoesAPI.add(sess);
    form.reset();
    renderSessoesList(container);
  });
}