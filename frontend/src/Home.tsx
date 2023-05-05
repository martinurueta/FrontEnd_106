import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import SearchBar from './SearchBar';
import './includes/main.css';
import CheckLogin from './includes/CheckLogin';
import HomePage from './Homepage';

const Home: React.FC = () => {
    const [searchResults, setSearchResults] = useState([]);
    const isLoggedIn = CheckLogin();


    return (
        <div>
            {isLoggedIn === null ? (
                <p>Loading...</p>
            ) : isLoggedIn ? (
                <>
                <SearchBar />
                {/* Render your search results here */}
                </>
            ) : (
                <HomePage />
            )}
        </div>
    );
};

export default Home;