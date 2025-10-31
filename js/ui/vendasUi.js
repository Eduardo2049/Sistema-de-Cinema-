function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

function formatCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function renderVendasList(container){
  const data = window.VendasAPI.list();
  container.innerHTML = '';
  if(!data.length){ container.textContent = 'Nenhuma venda realizada.'; return; }
  const ul = document.createElement('ul'); ul.className='list-group';
  data.forEach((v, i)=>{
    const li=document.createElement('li'); li.className='list-group-item';
    
    const vendaInfo = document.createElement('div');
    vendaInfo.className = 'd-flex justify-content-between align-items-start';
    
    const details = document.createElement('div');
    details.className = 'flex-grow-1';
    details.innerHTML = `
      <h6 class="mb-1"><strong>${escapeHtml(v.clientName || 'Cliente')}</strong></h6>
      <p class="mb-1 small">CPF: ${escapeHtml(v.cpf || 'N/A')} | Assento: ${escapeHtml(v.seat || 'N/A')}</p>
      <div class="small text-muted">
        <span class="badge bg-info me-1">Sessão: ${escapeHtml(v.sessionInfo || v.sessionId || 'N/A')}</span>
        <span class="badge bg-success me-1">💰 R$ ${escapeHtml(v.price || '0.00')}</span>
        <span class="badge bg-secondary">${escapeHtml(v.paymentType || 'N/A')}</span>
      </div>
    `;
    
    vendaInfo.appendChild(details);
    li.appendChild(vendaInfo);
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function bindVendaForm(form, container){
  const cpfInput = form.cpf;
  if(cpfInput) {
    cpfInput.addEventListener('input', (e) => {
      e.target.value = formatCPF(e.target.value);
    });
  }
  
  form.addEventListener('submit', e=>{
    e.preventDefault();
    
    const sessionId = form.sessionId.value;
    const sessions = window.SessoesAPI.list();
    const session = sessions[sessionId];
    const sessionInfo = session ? `${session.movieTitle} - ${session.datetime}` : '';
    const price = session ? session.price : '0.00';
    
    const sale = { 
      sessionId: sessionId,
      sessionInfo: sessionInfo,
      clientName: form.clientName.value.trim(),
      cpf: form.cpf.value.trim(),
      seat: form.seat.value.trim().toUpperCase(),
      paymentType: form.paymentType.value,
      price: price
    };
    
    if(!sale.sessionId || !sale.clientName || !sale.cpf || !sale.seat || !sale.paymentType) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Validação básica de CPF (11 dígitos)
    const cpfDigits = sale.cpf.replace(/\D/g, '');
    if(cpfDigits.length !== 11) {
      alert('CPF inválido. Digite 11 dígitos.');
      return;
    }
    
    window.VendasAPI.add(sale);
    form.reset();
    renderVendasList(container);
    alert('Venda confirmada com sucesso!');
  });
}

function populateSessionSelect(selectEl, priceInput){
  if(!selectEl) return;
  if(!window.SessoesAPI || typeof window.SessoesAPI.list !== 'function') return;
  
  const sessions = window.SessoesAPI.list();
  selectEl.innerHTML = '<option value="" disabled selected>Selecione uma sessão</option>';
  
  sessions.forEach((s, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.dataset.price = s.price || '0.00';
    opt.textContent = `${s.movieTitle || 'Filme'} - ${s.datetime || 'Data/Hora'} - Sala ${s.roomName || s.roomId || 'N/A'} (R$ ${s.price || '0.00'})`;
    selectEl.appendChild(opt);
  });
  
  // Update price when session is selected
  if(priceInput) {
    selectEl.addEventListener('change', (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      if(selectedOption && selectedOption.dataset.price) {
        priceInput.value = selectedOption.dataset.price;
      }
    });
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedSession = urlParams.get('sessao');
  if(preSelectedSession !== null && preSelectedSession !== '') {
    selectEl.value = preSelectedSession;
    selectEl.dispatchEvent(new Event('change'));
  }
}