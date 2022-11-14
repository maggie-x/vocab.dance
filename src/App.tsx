import './App.css';
import { GradientText } from './components/gradient-text';
import { Layout } from './components/layout';
import Move from './components/move';
import { SearchBar } from './components/search-bar';

function App() {
  return (
    <div className="flex flex-col items-center">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Layout>
        <GradientText text={'💃 Dance Vocab Index'} />
        <SearchBar searchString={''} />
        <div className="mt-8 flex flex-col space-y-12">
          <Move
            name={'Milly Rock'}
            gifLink={
              'https://media.giphy.com/media/26ufpo2M9CL8oB1AI/giphy.gif'
            }
            infoSrc={'https://www.google.com'}
          />
          <Move
            name={'Harlem Shake'}
            gifLink={'https://media.giphy.com/media/anRWvX6MDOq76/giphy.gif'}
            infoSrc={'https://www.google.com'}
          />
        </div>
      </Layout>
    </div>
  );
}

export default App;
