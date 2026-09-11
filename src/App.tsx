import {
  Navigate,
  ScrollRestoration,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useState } from 'react';
import { useLocalStorage, useTitle } from 'react-use';
import './App.css';
import AboutDialog from './components/about';
import Feedback from './components/feedback';
import { Title } from './components/gradient-text';
import { Layout } from './components/layout';
import ViewMenu, { ViewMode } from './components/view-menu/view-menu';
import { DEFAULT_STYLE_SLUG, isStyleSlug, STYLES } from './data';
import { useScrollToTopOnChange } from './hooks/use-scroll-to-top';
import Main from './pages/main';
import MovePage from './pages/move';

function App() {
  const { style, move } = useParams();
  const navigate = useNavigate();
  const [viewMode = 'cards', setViewMode] = useLocalStorage<ViewMode>(
    'viewMode',
    'cards'
  );
  const [aboutOpen, setAboutOpen] = useState(false);
  useScrollToTopOnChange(viewMode);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (move) {
      navigate(`/${slug}`);
    }
  };
  const isKnownStyle = style === undefined || isStyleSlug(style);
  const slug = isStyleSlug(style) ? style : DEFAULT_STYLE_SLUG;

  useTitle(
    isStyleSlug(style)
      ? `${STYLES[slug].label} | Dance Vocab Index`
      : 'Dance Vocab Index'
  );

  if (!isKnownStyle) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center font-mono bg-zinc-900 text-white">
      <ScrollRestoration />
      <ViewMenu
        viewMode={viewMode}
        onChange={handleViewModeChange}
        onAbout={() => setAboutOpen(true)}
      />
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <Layout>
        <Title />
        {move ? (
          <MovePage slug={slug} moveSlugParam={move} />
        ) : (
          <Main key={slug} slug={slug} viewMode={viewMode} />
        )}
        <Feedback />
      </Layout>
    </div>
  );
}

export default App;
