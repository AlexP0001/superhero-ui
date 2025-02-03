import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [superheroes, setSuperheroes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    superpower: '',
    humility: '',
  });
  const [error, setError] = useState(null);

  // Function to fetch superheroes from the backend
  const fetchSuperheroes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/superheroes');
      setSuperheroes(response.data);
    } catch (err) {
      console.error('Error fetching superheroes', err);
    }
  };

  // Fetch the list on component mount
  useEffect(() => {
    fetchSuperheroes();
  }, []);

  // Update form state when input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that humility is a number between 1 and 10
    const humility = parseInt(formData.humility, 10);
    if (isNaN(humility) || humility < 1 || humility > 10) {
      setError('Humility must be a number between 1 and 10.');
      return;
    }

    try {
      const superhero = {
        name: formData.name,
        superpower: formData.superpower,
        humility: humility,
      };

      // POST the new superhero to the backend
      await axios.post('http://localhost:3000/superheroes', superhero);

      // Clear the form and error
      setFormData({ name: '', superpower: '', humility: '' });
      setError(null);

      // Re-fetch the superhero list to update it immediately
      fetchSuperheroes();
    } catch (err) {
      console.error('Error adding superhero', err);
      setError('Failed to add superhero.');
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Superheroes</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div>
          <label>Name:&nbsp;</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Superpower:&nbsp;</label>
          <input
            type="text"
            name="superpower"
            value={formData.superpower}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Humility (1-10):&nbsp;</label>
          <input
            type="number"
            name="humility"
            value={formData.humility}
            onChange={handleInputChange}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: '1rem' }}>Add Superhero</button>
      </form>

      <h2>Sorted Superheroes (by Humility Descending)</h2>
      <ul>
        {superheroes.map((hero, index) => (
          <li key={index}>
            <strong>{hero.name}</strong> – {hero.superpower} (Humility: {hero.humility})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;