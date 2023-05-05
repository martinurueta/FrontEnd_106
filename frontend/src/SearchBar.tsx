import React, { useState, useEffect } from 'react';
import './includes/main.css';



const SearchBar: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchText.trim() === '') {
                setSearchResults([]);
                return;
            }

            const response = await fetch(`/api/search-courses?q=${encodeURIComponent(searchText)}`);
            const data = await response.json();
            setSearchResults(data);
        };

        fetchSearchResults();
    }, [searchText]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="search-container">
            <form className="search-box" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for courses"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                {/* <button className="custom-btn btn-1" type="submit">
                    Search
                </button> */}
            </form>
            <div className="search-results-container"> {/* Add this wrapper div */}
                {searchResults.length > 0 && (
                    <ul className="search-results">
                        {searchResults.map((result: string, index: number) => (
                            <a href={`/course/${result}`}>
                                <li key={index}>
                                    {result}
                                </li>
                            </a>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
