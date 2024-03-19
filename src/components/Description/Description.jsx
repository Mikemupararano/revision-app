import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './description.css';

const Description = ({ searchTerm }) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`);
        setDescription(response.data.extract);
      } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
      }
    };

    fetchData();
  }, [searchTerm]);

  return (
    <div>
      <h2>What is {searchTerm}?</h2>
      <p>{description}</p>
    </div>
  );
};

export default Description;