import { useState } from 'react';
import Search from './components/Search';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main>
      <img
        src="./public/assets/hero-bg.png"
        className="pattern"
        alt="hero image"
      />
      <div className="wrapper">
        <header>
          <img src="./public/assets/hero.png" alt="hero image" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <h3 className="text-amber-400 text-2xl">{searchTerm}</h3>
      </div>
    </main>
  );
}

export default App;
