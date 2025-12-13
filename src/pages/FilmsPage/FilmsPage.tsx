import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FilmForm } from '../../components/films/FilmForm';
import { FilmList } from '../../components/films/FilmList';
import { useFilms } from '../../hooks/useFilms';
import { Film } from '../../types';
import './FilmsPage.scss';

export const FilmsPage = () => {
    const { films, addFilm, updateFilm, removeFilm } = useFilms();
    const [editingFilm, setEditingFilm] = useState<Film | null>(null);

    const handleAddOrUpdateFilm = (film: Film) => {
        if (editingFilm && editingFilm.id) {
            updateFilm(editingFilm.id, film);
            alert('Filme atualizado com sucesso!');
            setEditingFilm(null);
        } else {
            addFilm(film);
            alert('Filme cadastrado com sucesso!');
        }
    };

    const handleEditFilm = (film: Film) => {
        setEditingFilm(film);
        // Scroll para o formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingFilm(null);
    };

    return (
        <div className="films-page">
            <Container fluid className="py-4">
                <Row>
                    <Col lg={10} className="offset-lg-1">
                        <h1 className="mb-4">🎥 Filmes</h1>
                        <div className="film-card">
                            <FilmForm 
                                onSubmit={handleAddOrUpdateFilm} 
                                editingFilm={editingFilm}
                                onCancelEdit={handleCancelEdit}
                            />
                        </div>
                        <FilmList 
                            films={films} 
                            onRemove={removeFilm}
                            onEdit={handleEditFilm}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
