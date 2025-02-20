import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/signin';
import Account from './pages/account';
import Main from './pages/main';
import Register from './pages/register';
import Video from './pages/video';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
                <Route path="/video/:id" element={<Video />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Main />} />
            </Routes>
        </Router>
    );
}

export default App;
