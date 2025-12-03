import { Container, Row, Col } from 'react-bootstrap';
import { FilmForm } from '../../components/films/FilmForm';
import { FilmList } from '../../components/films/FilmList';
import { useFilms } from '../../hooks/useFilms';
import { Film } from '../../types';
import './FilmsPage.scss';

export const FilmsPage = () => {
    const { films, addFilm, removeFilm } = useFilms();

    const handleAddFilm = (film: Film) => {
        addFilm(film);
        alert('Filme cadastrado com sucesso!');
    };

    return (
        <div className="films-page">
            <Container fluid className="py-4">
                <Row>
                    <Col lg={10} className="offset-lg-1">
                        <h1 className="mb-4">🎥 Filmes</h1>
                        <div className="film-card">
                            <FilmForm onSubmit={handleAddFilm} />
                        </div>
                        <FilmList films={films} onRemove={removeFilm} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
