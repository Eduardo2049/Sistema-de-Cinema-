import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { FilmsPage } from './pages/FilmsPage';
import { RoomsPage } from './pages/RoomsPage';
import { SessionsPage } from './pages/SessionsPage';
import { SalesPage } from './pages/SalesPage';

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
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
