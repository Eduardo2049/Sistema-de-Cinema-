import { useState, useEffect } from 'react';
import { Film } from '../types';
import { SupabaseService } from '../services/supabase.service';

export const useFilms = () => {
    const [films, setFilms] = useState<Film[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadFilms();
    }, []);

    const loadFilms = async () => {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await SupabaseService.getAll<any>('films');

        if (fetchError) {
            setError('Erro ao carregar filmes: ' + fetchError.message);
            console.error(fetchError);
        } else {
            // Converter release_date (snake_case) para releaseDate (camelCase)
            const filmsFormatted = (data || []).map((film: any) => ({
                ...film,
                releaseDate: film.release_date
            }));
            setFilms(filmsFormatted);
        }

        setLoading(false);
    };

    const addFilm = async (film: Omit<Film, 'id' | 'created_at'>) => {
        setLoading(true);
        setError(null);

        // Converter releaseDate (camelCase) para release_date (snake_case)
        const { releaseDate, ...filmRest } = film;
        const filmData = {
            ...filmRest,
            release_date: releaseDate
        };

        const { error: createError } = await SupabaseService.create<Film>('films', filmData);

        if (createError) {
            setError('Erro ao adicionar filme: ' + createError.message);
            console.error(createError);
        } else {
            await loadFilms(); // Recarregar lista
        }

        setLoading(false);
    };

    const removeFilm = async (id: string) => {
        setLoading(true);
        setError(null);

        const { error: deleteError } = await SupabaseService.delete('films', id);

        if (deleteError) {
            setError('Erro ao remover filme: ' + deleteError.message);
            console.error(deleteError);
        } else {
            await loadFilms(); // Recarregar lista
        }

        setLoading(false);
    };

    return {
        films,
        loading,
        error,
        addFilm,
        removeFilm,
        refreshFilms: loadFilms
    };
};
