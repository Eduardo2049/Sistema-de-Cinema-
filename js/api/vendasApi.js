window.VendasAPI = {
  key: 'ingressos',
  add(sale){
    const list = window.StorageAPI.getData(this.key);
    list.push(sale);
    window.StorageAPI.saveData(this.key, list);
  },
  list(){ return window.StorageAPI.getData(this.key); }
};