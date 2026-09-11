import { Navigate, useParams } from 'react-router-dom';
import { useLocalStorage, useTitle } from 'react-use';
import './App.css';
import Feedback from './components/feedback';
import { Title } from './components/gradient-text';
import { Layout } from './components/layout';
import ViewMenu, { ViewMode } from './components/view-menu/view-menu';
import { DEFAULT_STYLE_SLUG, isStyleSlug, STYLES } from './data';
import Main from './pages/main';

function App() {
  const { style } = useParams();
  const [viewMode = 'cards', setViewMode] = useLocalStorage<ViewMode>(
    'viewMode',
    'cards'
  );
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
      <ViewMenu viewMode={viewMode} onChange={setViewMode} />
      <Layout>
        <Title />
        <Main slug={slug} viewMode={viewMode} />
        <Feedback />
      </Layout>
    </div>
  );
}

export default App;
