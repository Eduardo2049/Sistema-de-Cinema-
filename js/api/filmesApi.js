window.FilmesAPI = {
  key: 'cinema_films',
  add(film){
    const list = window.StorageAPI.getData(this.key);
    list.push(film);
    window.StorageAPI.saveData(this.key, list);
  },
  list(){
    return window.StorageAPI.getData(this.key);
  },
  remove(index){
    const list = window.StorageAPI.getData(this.key);
    list.splice(index, 1);
    window.StorageAPI.saveData(this.key, list);
  }
};