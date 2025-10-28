window.SessoesAPI = {
  key: 'cinema_sessions',
  add(session){
    const list = window.StorageAPI.getData(this.key);
    list.push(session);
    window.StorageAPI.saveData(this.key, list);
  },
  list(){ return window.StorageAPI.getData(this.key); },
  remove(i){ const list = window.StorageAPI.getData(this.key); list.splice(i,1); window.StorageAPI.saveData(this.key,list); }
};