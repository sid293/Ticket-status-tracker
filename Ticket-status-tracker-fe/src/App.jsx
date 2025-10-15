import { useState } from 'react';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { isAuthenticated } from './utils/auth.js';

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  return (
    <div className="App">
      {authenticated ? (
        <Dashboard />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
