import { useState, useEffect } from 'react';
import { Film } from '../types';
import { StorageService } from '../services/storage';

const STORAGE_KEY = 'cinema_films';

export const useFilms = () => {
    const [films, setFilms] = useState<Film[]>([]);

    useEffect(() => {
        loadFilms();
    }, []);

    const loadFilms = () => {
        const data = StorageService.getData<Film>(STORAGE_KEY);
        setFilms(data);
    };

    const addFilm = (film: Film) => {
        StorageService.addItem<Film>(STORAGE_KEY, film);
        loadFilms();
    };

    const removeFilm = (index: number) => {
        StorageService.removeItem<Film>(STORAGE_KEY, index);
        loadFilms();
    };

    return {
        films,
        addFilm,
        removeFilm,
        refreshFilms: loadFilms
    };
};
