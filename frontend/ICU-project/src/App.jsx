import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Homepage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound';
import RegistrationForm from './pages/RegisterForm';
import LoginForm from './pages/LoginForm';
import AdminPage from './pages/AdminPage';
import Map from './pages/Map';
import io from 'socket.io-client';
import Home from './pages/Home';

// Use the correct server URL for the socket connection
const socket = io("http://localhost:3030", {
  transports: ['websocket'], // Use WebSocket transport explicitly
  autoConnect: true,         // Automatically connect
});
function App() {
    useEffect(() => {
        // Listen for "Data" event when the component mounts
        socket.on('Data', (data) => {
            console.log('Data received from server:', data);
        });

        // Cleanup to avoid memory leaks
        return () => {
            socket.off('Data');
        };
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/Login" element={<LoginForm />} />
                <Route path="/Register" element={<RegistrationForm />} />
                <Route path="/Admin" element={<AdminPage />} />
                <Route path="/Map" element={<Map />} />
                <Route path="/Home" element={<Home />} />
                <Route path="" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;