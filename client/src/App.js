import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
   axios.get('/api/areas')
  .then(res => console.log(res.data))
  .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Express + React Starter</h1>
      <p>Check console for API response.</p>
    </div>
  );
}

export default App;