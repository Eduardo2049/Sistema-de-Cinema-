import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const HomePage = () => {
    return (
        <Container fluid className="px-3 px-md-5 py-5">
            <Row className="justify-content-center">
                <Col xs={12} xl={10}>

                    {/* Jumbotron */}
                    <Row className="mb-5">
                        <Col xs={12}>
                            <div className="bg-light p-4 p-md-5 rounded">
                                <h1 className="display-5 display-md-4 fw-bold mb-3">🎬 Bem-vindo ao Projeto Cinema</h1>
                                <p className="lead mb-3">Sistema de controle de cinema com filmes, sessões, salas e vendas de ingressos.</p>
                                <hr className="my-4" />
                                <p className="mb-0">Clique em <strong>"Filmes"</strong> na barra de navegação para começar a cadastrar.</p>
                            </div>
                        </Col>
                    </Row>

                    {/* Cards Section */}
                    <Row className="g-3">
                        <Col xs={12} sm={6} lg={3}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="text-center">
                                    <Card.Title className="mb-3">🎥 Filmes</Card.Title>
                                    <Card.Text className="small">Cadastre e gerencie os filmes do cinema.</Card.Text>
                                    <Link to="/filmes" className="btn btn-primary btn-sm mt-2">Acessar</Link>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xs={12} sm={6} lg={3}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="text-center">
                                    <Card.Title className="mb-3">🎭 Salas</Card.Title>
                                    <Card.Text className="small">Configure as salas do cinema.</Card.Text>
                                    <Link to="/salas" className="btn btn-primary btn-sm mt-2">Acessar</Link>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xs={12} sm={6} lg={3}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="text-center">
                                    <Card.Title className="mb-3">⏰ Sessões</Card.Title>
                                    <Card.Text className="small">Crie sessões de exibição.</Card.Text>
                                    <Link to="/sessoes" className="btn btn-primary btn-sm mt-2">Acessar</Link>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xs={12} sm={6} lg={3}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="text-center">
                                    <Card.Title className="mb-3">🎫 Vendas</Card.Title>
                                    <Card.Text className="small">Venda ingressos para as sessões.</Card.Text>
                                    <Link to="/vendas" className="btn btn-primary btn-sm mt-2">Acessar</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </Col>
            </Row>
        </Container>
    );
};
