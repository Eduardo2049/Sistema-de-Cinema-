window.StorageAPI = {
  getData(key){
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  },
  saveData(key, arr){
    localStorage.setItem(key, JSON.stringify(arr));
  }
};