import Nav from './components/Nav';
import Footer from './components/Footer';
import ArtifactsShowcase from './components/ArtifactsShowcase';
import Testimonials from './components/Testimonials';
import Expertise from './components/Expertise';

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>

        {/* ARTIFACTS SHOWCASE */}
        <ArtifactsShowcase />

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* WHAT YOU'D GET FROM ME */}
        <Expertise />

      </main>
      <Footer />
    </div>
  );
}
