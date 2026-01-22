import React, { useEffect, useState, useRef } from 'react';
import '../../styles/reels.css';
import '../../styles/home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [reels, setReels] = useState([]);
    const [error, setError] = useState(null);
    const [isAuthed, setIsAuthed] = useState(false);
    const navigate = useNavigate();
    
    // In C++, this is like an array of pointers to video objects
    const videoRefs = useRef([]);

    useEffect(() => {
        let isMounted = true; // Prevents double-fetch in Strict Mode

        const fetchReels = async () => {
            try {
                const response = await axios.get('https://food-scroll-iopy.onrender.com/api/food', {
                    withCredentials: true 
                });
                
                if (isMounted && response.data && response.data.foodItems) {
                    // Schedule state updates on microtask to avoid cascading renders
                    Promise.resolve().then(() => {
                        if (!isMounted) return;
                        setReels(response.data.foodItems);
                        setError(null);
                        setIsAuthed(true);
                    });
                }
            } catch (err) {
                if (!isMounted) return;

                const status = err?.response?.status;
                if (status === 401) {
                    setIsAuthed(false);
                    return;
                }

                console.error("Connection Error:", err);
                Promise.resolve().then(() => {
                    if (!isMounted) return;
                    setError("Connection failed. Ensure the backend is running and matches CORS origin.");
                });
            }
        };

        fetchReels();

        return () => {
            isMounted = false; // Cleanup logic
        };
    }, []);

    // Intersection Observer for playing videos smoothly
  // Intersection Observer for playing videos smoothly
useEffect(() => {
    if (reels.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(async (entry) => {
                const video = entry.target;

                if (entry.isIntersecting) {
                    try {
                        // We await the play promise or catch it to handle the interruption
                        await video.play();
                    } catch (err) {
                        // This catches the AbortError silently so it doesn't clutter your console
                        if (err.name !== 'AbortError') {
                            console.warn("Playback error:", err);
                        }
                    }
                } else {
                    // Only pause if the video isn't already paused
                    if (!video.paused) {
                        video.pause();
                    }
                }
            });
        },
        { threshold: 0.7 } 
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));

    return () => {
        observer.disconnect();
    };
}, [reels]);

    
    return (
        <div className="home-shell">
            {error && <div className="error-message">{error}</div>}

            <section className="home-actions">
                <div className="home-actions-grid one-col">
                <div className="card">
                    <div className="card-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7-11-7z"></path>
                        </svg>
                    </div>
                    <h3>Watch Reels</h3>
                    <p>Sign in as a user to watch food reels.</p>
                    <button
                        onClick={() => {
                            if (isAuthed) {
                                const el = document.getElementById('reels');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                navigate('/user/login');
                            }
                        }}
                    >
                        {isAuthed ? 'Scroll to Reels' : 'User sign-in required'}
                    </button>
                </div>

                <div className="card">
                    <div className="card-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z"></path>
                        </svg>
                    </div>
                    <h3>User</h3>
                    <div style={{display:'flex', gap:8}}>
                        <button onClick={() => navigate('/user/login')}>Login</button>
                        <button onClick={() => navigate('/user/register')}>Register</button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 7h16l-1 5H5L4 7zm1 7h14v7H5v-7zM9 2h6l1 5H8l1-5z"></path>
                        </svg>
                    </div>
                    <h3>Food Partner</h3>
                    <div style={{display:'flex', gap:8}}>
                        <button onClick={() => navigate('/food-partner/login')}>Login</button>
                        <button onClick={() => navigate('/food-partner/register')}>Register</button>
                    </div>
                </div>
            </div>
            </section>

            {isAuthed && reels.length > 0 && (
                <div id="reels" className="reels-container">
                    {reels.map((item, index) => (
                        <section key={item._id} className="reel-item">
                            <div className="media">
                                <video 
                                    ref={(el) => (videoRefs.current[index] = el)}
                                    className="reel-video"
                                    playsInline
                                    muted
                                    loop
                                    preload="metadata"
                                >
                                    <source src={item.video} type="video/mp4" />
                                </video>
                            </div>

                            <div className="overlay">
                                <div className="desc-container">
                                    <h3 className="food-name">{item.name || 'Delicious Food'}</h3>
                                    <p className="desc">{item.description || 'No description provided.'}</p>
                                </div>

                                <button
                                    className="visit-btn"
                                    onClick={() => navigate(`/food-partner/${item.foodPartner}`)}
                                >
                                    Visit Store
                                </button>
                            </div>
                        </section>
                    ))}
                </div>
            )}

            {isAuthed && reels.length === 0 && (
                <div className="loading">Loading Reels...</div>
            )}
        </div>
    );
};

export default Home;
