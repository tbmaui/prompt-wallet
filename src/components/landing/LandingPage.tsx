import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Features } from './Features';
import { Footer } from './Footer';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white selection:bg-indigo-500/30">
            <Navbar />
            <main>
                <Hero />
                <Features />
            </main>
            <Footer />
        </div>
    );
}
