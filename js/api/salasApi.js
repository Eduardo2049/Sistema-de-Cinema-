window.SalasAPI = {
  key: 'cinema_rooms',
  add(room){
    const list = window.StorageAPI.getData(this.key);
    list.push(room);
    window.StorageAPI.saveData(this.key, list);
  },
  list(){ return window.StorageAPI.getData(this.key); },
  remove(i){ const list = window.StorageAPI.getData(this.key); list.splice(i,1); window.StorageAPI.saveData(this.key,list); }
};