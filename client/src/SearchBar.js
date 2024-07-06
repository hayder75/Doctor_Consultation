import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ setSearchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/doctors/search?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching for doctors:', error);
      setSearchResults([]);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search for doctors..." 
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
