import { Container } from 'react-bootstrap';
import './Footer.scss';

export const Footer = () => {
    return (
        <footer className="footer-custom text-center py-4 mt-5 w-100">
            <Container fluid>
                <p className="mb-0">&copy; 2025 Projeto Cinema — Todos os direitos reservados.</p>
            </Container>
        </footer>
    );
};
