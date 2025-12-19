import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 900); // 4 second delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <InputGroup className="mb-3">
      <InputGroup.Text id="search-icon">Search</InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Search users by email..."
        value={searchTerm}
        onChange={handleChange}
        aria-label="Search users"
        aria-describedby="search-icon"
      />
    </InputGroup>
  );
};

export default SearchBar;
