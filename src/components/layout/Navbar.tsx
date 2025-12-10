import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';

export const Navbar = () => {
    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top" className="border-bottom">
            <Container fluid>
                <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
                    🎬 Projeto Cinema
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="navbarNav" />
                <BootstrapNavbar.Collapse id="navbarNav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/filmes">Filmes</Nav.Link>
                        <Nav.Link as={Link} to="/sessoes">Sessões</Nav.Link>
                        <Nav.Link as={Link} to="/salas">Salas</Nav.Link>
                        <Nav.Link as={Link} to="/lanches">Lanches</Nav.Link>
                        <Nav.Link as={Link} to="/vendas">Vendas</Nav.Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};
