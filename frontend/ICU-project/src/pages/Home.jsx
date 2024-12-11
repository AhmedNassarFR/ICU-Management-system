import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './Home.css';

// Connect to the backend via Socket.IO
const socket = io('http://localhost:3030');

const Home = ({ userId }) => {
    const [location, setLocation] = useState(null);
    const [icus, setICUs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLocationAndICUs = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ latitude, longitude });

                        try {
                            setLoading(true);
                            const response = await axios.get(
                                'http://localhost:3030/patient/get-available-icus',
                                {
                                    params: {
                                        userLocation: `${longitude},${latitude}`, // Fixed the template literal
                                    },
                                }
                            );
                            setICUs(response.data.icus || []);
                        } catch (err) {
                            console.error('Error fetching ICUs:', err);
                            setError('Unable to fetch ICUs. Please try again later.');
                        } finally {
                            setLoading(false);
                        }
                    },
                    (err) => {
                        console.error('Error fetching location:', err);
                        setError('Please enable location services to find ICUs near you.');
                    }
                );
            } else {
                setError('Geolocation is not supported by your browser.');
            }
        };

        fetchLocationAndICUs();

        // Listen for real-time ICU updates
        const handleICUUpdate = (updatedICUs) => {
            setICUs(updatedICUs);
        };
        socket.on('icuUpdated', handleICUUpdate);

        // Cleanup the socket listener on unmount
        return () => {
            socket.off('icuUpdated', handleICUUpdate);
        };
    }, []);

    const handleReserveICU = async (icuId) => {
        try {
            await axios.post('http://localhost:3030/patient/reserve-icu', {
                userId,
                icuId,
            });
            alert('ICU reserved successfully!');
        } catch (err) {
            console.error('Error reserving ICU:', err);
            alert('Failed to reserve ICU. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading ICUs...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="home-container">
            <h1>ICUs Near You</h1>
            {icus.length === 0 ? (
                <p>No ICUs available near your location.</p>
            ) : (
                <ul className="icu-list">
                    {icus.map((icu) => (
                        <li key={icu._id} className="icu-item">
                            <h3>{icu.hospital.name}</h3>
                            <p>Address: {icu.hospital.address}</p>
                            <p>Specialization: {icu.specialization}</p>
                            <p>Fees: ${icu.fees}</p>
                            <button
                                onClick={() => handleReserveICU(icu._id)}
                                className="reserve-button"
                            >
                                Reserve
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Home;
