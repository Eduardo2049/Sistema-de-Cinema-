import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdMovie, MdTheaters, MdSchedule, MdConfirmationNumber, MdArrowForward } from 'react-icons/md';
import { useFilms } from '../../hooks/useFilms';
import { useRooms } from '../../hooks/useRooms';
import { useSales } from '../../hooks/useSales';
import { useSessions } from '../../hooks/useSessions';

import './HomePage.scss';

export const HomePage = () => {
    // Hooks para obter contadores
    const { films } = useFilms();
    const { rooms } = useRooms();
    const { sessions } = useSessions();
    const { sales } = useSales();

    // Dados dos cards com ícones e cores
    const features = [
        {
            icon: MdMovie,
            title: 'Filmes',
            description: 'Cadastre e gerencie os filmes do cinema',
            path: '/filmes',
            color: 'primary',
            count: films.length,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderColor: '#667eea' // Roxo do gradiente
        },
        {
            icon: MdTheaters,
            title: 'Salas',
            description: 'Configure as salas do cinema',
            path: '/salas',
            color: 'success',
            count: rooms.length,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderColor: '#f093fb' // Rosa do gradiente
        },
        {
            icon: MdSchedule,
            title: 'Sessões',
            description: 'Crie sessões de exibição',
            path: '/sessoes',
            color: 'warning',
            count: sessions.length,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderColor: '#4facfe' // Azul claro do gradiente
        },
        {
            icon: MdConfirmationNumber,
            title: 'Vendas',
            description: 'Venda ingressos para as sessões',
            path: '/vendas',
            color: 'danger',
            count: sales.length,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            borderColor: '#43e97b' // Verde do gradiente
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Section Melhorado */}
            <div className="hero-section">
                <Container fluid className="px-3 px-md-5 py-5">
                    <Row className="justify-content-center">
                        <Col xs={12} xl={10}>
                            <div className="jumbotron">
                                <div className="hero-content">
                                    <h1 className="display-4 fw-bold mb-3">
                                        🎬 Sistema de Gestão de Cinema
                                    </h1>
                                    <p className="lead mb-4">
                                        Gerencie filmes, salas, sessões e vendas de ingressos de forma simples e eficiente.
                                    </p>
                                    <div className="hero-stats">
                                        <div className="stat-item">
                                            <span className="stat-number">{films.length}</span>
                                            <span className="stat-label">Filmes</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{rooms.length}</span>
                                            <span className="stat-label">Salas</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{sessions.length}</span>
                                            <span className="stat-label">Sessões</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{sales.length}</span>
                                            <span className="stat-label">Vendas</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Cards Section Melhorado */}
            <Container fluid className="px-3 px-md-5 pb-5">
                <Row className="justify-content-center">
                    <Col xs={12} xl={10}>
                        <h2 className="text-center mb-4 fw-bold">Funcionalidades</h2>
                        <Row className="g-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <Col key={index} xs={12} sm={6} lg={3}>
                                        <Card className="h-100 feature-card" style={{ borderTop: `4px solid ${feature.borderColor}` }}>
                                            <Card.Body className="text-center d-flex flex-column">
                                                <div className="icon-wrapper mb-3" style={{ background: feature.gradient }}>
                                                    <Icon size={32} color="white" />
                                                </div>
                                                <Card.Title className="mb-2 fw-bold">
                                                    {feature.title}
                                                    {feature.count > 0 && (
                                                        <Badge
                                                            className="ms-2"
                                                            style={{
                                                                backgroundColor: feature.borderColor,
                                                                color: 'white'
                                                            }}
                                                        >
                                                            {feature.count}
                                                        </Badge>
                                                    )}
                                                </Card.Title>
                                                <Card.Text className="small text-muted flex-grow-1">
                                                    {feature.description}
                                                </Card.Text>
                                                <Link to={feature.path} className="text-decoration-none mt-3">
                                                    <Button
                                                        size="sm"
                                                        className="w-100"
                                                        style={{
                                                            backgroundColor: feature.borderColor,
                                                            borderColor: feature.borderColor,
                                                            color: 'white'
                                                        }}
                                                    >
                                                        Acessar <MdArrowForward />
                                                    </Button>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* Seção de Informações Detalhadas */}
            <Container fluid className="px-3 px-md-5 pb-5">
                <Row className="justify-content-center">
                    <Col xs={12} xl={10}>
                        <h2 className="text-center mb-4 fw-bold">Informações</h2>
                        <Row className="g-4">
                            {/* Card 1: Filmes */}
                            <Col xs={12} md={6}>
                                <Card className="info-card h-100">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="info-icon-wrapper me-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                                <MdMovie size={24} color="white" />
                                            </div>
                                            <Card.Title className="mb-0 fw-bold">Gestão de Filmes</Card.Title>
                                        </div>
                                        <Card.Text className="text-muted">
                                            Cadastre e gerencie todo o catálogo de filmes do seu cinema. Adicione informações como título,
                                            descrição, gênero, classificação indicativa, duração e data de estreia. Mantenha seu acervo
                                            sempre atualizado e organizado.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Card 2: Salas */}
                            <Col xs={12} md={6}>
                                <Card className="info-card h-100">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="info-icon-wrapper me-3" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                                                <MdTheaters size={24} color="white" />
                                            </div>
                                            <Card.Title className="mb-0 fw-bold">Configuração de Salas</Card.Title>
                                        </div>
                                        <Card.Text className="text-muted">
                                            Configure as salas de exibição do cinema com informações sobre nome, tipo (2D, 3D, IMAX),
                                            e capacidade de assentos. Organize sua estrutura física de forma eficiente para otimizar
                                            a experiência dos espectadores.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Card 3: Sessões */}
                            <Col xs={12} md={6}>
                                <Card className="info-card h-100">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="info-icon-wrapper me-3" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                                                <MdSchedule size={24} color="white" />
                                            </div>
                                            <Card.Title className="mb-0 fw-bold">Programação de Sessões</Card.Title>
                                        </div>
                                        <Card.Text className="text-muted">
                                            Crie e gerencie as sessões de exibição vinculando filmes às salas disponíveis. Defina horários,
                                            preços, idioma (legendado ou dublado) e formato de exibição. Mantenha uma programação organizada
                                            e acessível para seu público.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Card 4: Vendas */}
                            <Col xs={12} md={6}>
                                <Card className="info-card h-100">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="info-icon-wrapper me-3" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                                                <MdConfirmationNumber size={24} color="white" />
                                            </div>
                                            <Card.Title className="mb-0 fw-bold">Controle de Vendas</Card.Title>
                                        </div>
                                        <Card.Text className="text-muted">
                                            Registre e acompanhe todas as vendas de ingressos realizadas. Capture informações do cliente,
                                            quantidade de ingressos, valor total e sessão escolhida. Tenha controle completo sobre a
                                            receita e ocupação do cinema.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Card 5: Agradecimentos */}
                            <Col xs={12}>
                                <Card className="info-card thank-you-card">
                                    <Card.Body className="text-center py-5">
                                        <h3 className="mb-3">🎉 Obrigado por usar nosso sistema!</h3>
                                        <p className="lead text-muted mb-4">
                                            Este sistema foi desenvolvido para facilitar a gestão completa do seu cinema,
                                            desde o cadastro de filmes até o controle de vendas.
                                        </p>
                                        <p className="text-muted mb-0">
                                            Desenvolvido com ❤️ usando <strong>React</strong>, <strong>TypeScript</strong>,
                                            <strong>Bootstrap</strong> e <strong>Supabase</strong>
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
