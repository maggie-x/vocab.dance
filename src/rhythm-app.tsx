import { useState } from 'react';
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import AboutDialog from './components/about';
import { Layout } from './components/layout';
import ViewMenu, { ViewMode } from './components/view-menu/view-menu';
import RhythmPage from './pages/rhythm';

/** The rhythm lab in the same shell as the move index: dark, mono, with the site menu in the corner. */
const RhythmApp = () => {
  const navigate = useNavigate();
  const [viewMode = 'cards', setViewMode] = useLocalStorage<ViewMode>('viewMode', 'cards');
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-900 font-mono text-white">
      <ScrollRestoration />
      <ViewMenu
        viewMode={viewMode}
        onChange={(mode) => { setViewMode(mode); navigate('/'); }}
        onAbout={() => setAboutOpen(true)}
      />
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <Layout>
        <RhythmPage />
      </Layout>
    </div>
  );
};

export default RhythmApp;
