import { useCallback, useState, useEffect } from 'react';
import { AuthContext } from './shared/context/auth-context';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './navigation/Navigation';
import Auth from './components/Auth';
import Tracker from './components/Tracker';
import './App.css';

let logoutTimer;
function App() {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState();

  const login = useCallback((uid, token, expiration) => {
    setUserId(uid);
    setToken(token);

    const expirationTime = expiration || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpiration(expirationTime);

    localStorage.setItem('loginToken', JSON.stringify({ userId: uid, token, expiration: expirationTime.toISOString() }));
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setTokenExpiration(null);
    localStorage.removeItem('loginToken');
  }, []);

  useEffect(() => {
    if (token && tokenExpiration) {
      const remaining = tokenExpiration.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remaining);
    } else clearTimeout(logoutTimer);
  }, [token, logout, tokenExpiration]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('loginToken'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path='/:uid/tracker' element={<Tracker />} />
        <Route path='*' element={<Navigate to={`/${userId}/tracker`} />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path='/authenticate' element={<Auth />} />
        <Route path='*' element={<Navigate to='/authenticate' />} />
      </Routes>
    );
  }

  return (
    <div className="App">
      <AuthContext.Provider
        value={{ userId, isLoggedIn: !!token, token: token, login, logout }} >
        <BrowserRouter>
          <Navigation />
          <main>
            {routes}
          </main>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
