import { ReactNode } from 'react';
import { Navbar } from './Navbar/Navbar';
import { Footer } from './Footer/Footer';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 w-100">
                {children}
            </main>
            <Footer />
        </div>
    );
};
