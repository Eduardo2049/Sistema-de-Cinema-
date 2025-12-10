import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage/HomePage';
import { FilmsPage } from './pages/FilmsPage/FilmsPage';
import { RoomsPage } from './pages/RoomsPage';
import { SessionsPage } from './pages/SessionsPage';
import { SalesPage } from './pages/SalesPage';
import { SnacksPage } from './pages/SnacksPage';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/filmes" element={<FilmsPage />} />
                    <Route path="/salas" element={<RoomsPage />} />
                    <Route path="/sessoes" element={<SessionsPage />} />
                    <Route path="/vendas" element={<SalesPage />} />
                    <Route path="/lanches" element={<SnacksPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
