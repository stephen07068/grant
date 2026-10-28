import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Grants from './pages/Grants';
import Categories from './pages/Categories';
import GrantDetail from './pages/GrantDetail';
import Apply from './pages/Apply';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ApplySuccess from './pages/ApplySuccess';
import ReviewsPage from './pages/ReviewsPage';
import GrantToast from './components/GrantToast';
import './styles/globals.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 24px' }}>
      <h1 style={{ fontSize: 80, fontWeight: 900, color: 'var(--gray-200)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>Page Not Found</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: 28 }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-navy">Back to Home</Link>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grants" element={<Grants />} />
          <Route path="/grants/:id" element={<GrantDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/apply-success" element={<ApplySuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <GrantToast />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
