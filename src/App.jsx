import { useEffect, useState } from 'react';
import { Search, MovieCard, Spinner } from './components/index';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import { useDebounce } from 'react-use';
import { getMovies } from './api/movieApi';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      const trendingSection = document.querySelector('.trending ul');
      if (trendingSection) {
        trendingSection.scrollBy({
          left: 200, // Adjust the scroll amount as needed
          behavior: 'smooth',
        });

        // Reset scroll position if at the end
        if (
          trendingSection.scrollLeft + trendingSection.offsetWidth >=
          trendingSection.scrollWidth
        ) {
          trendingSection.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 3000); // Adjust the interval time as needed (e.g., 3000ms = 3 seconds)

    return () => clearInterval(scrollInterval); // Cleanup on component unmount
  }, []);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getMovies(query);
      const data = await response.json();

      if (data?.response === 'false') {
        setErrorMessage(data.error || 'No movies found');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage(
        'An error occurred while fetching movies. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const result = await getTrendingMovies();
      setTrendingMovies(result);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  return (
    <main>
      <img src="./assets/hero-bg1.png" className="pattern" alt="hero image" />
      <div className="wrapper">
        <header>
          <img src="/assets/hero.png" alt="hero image" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-[30px]">Movie List</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className=" text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
      <footer className="mt-10 text-gray-500 text-sm w-full h-[150px] bg-black">
        <div className="wrapper items-center">
          <p>© 2025 Movie Finder. All rights reserved.</p>
          <p>Powered by TMDB</p>
        </div>
      </footer>
    </main>
  );
}

export default App;
