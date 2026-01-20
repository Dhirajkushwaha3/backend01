import React, { useEffect, useState, useRef } from 'react';
import '../../styles/reels.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [reels, setReels] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // In C++, this is like an array of pointers to video objects
    const videoRefs = useRef([]);

    useEffect(() => {
        let isMounted = true; // Prevents double-fetch in Strict Mode

        const fetchReels = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/food', {
                    withCredentials: true 
                });
                
                if (isMounted && response.data && response.data.foodItems) {
                    // Schedule state updates on microtask to avoid cascading renders
                    Promise.resolve().then(() => {
                        if (!isMounted) return;
                        setReels(response.data.foodItems);
                        setError(null);
                    });
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Connection Error:", err);
                    Promise.resolve().then(() => {
                        if (!isMounted) return;
                        setError("Connection failed. Ensure the backend is running and matches CORS origin.");
                    });
                }
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

    if (error) return <div className="error-message">{error}</div>;
    
    if (reels.length === 0) {
        return <div className="loading">Loading Reels...</div>;
    }

    return (
        <div className="reels-container">
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
                            <h3 className="food-name">{item.name || "Delicious Food"}</h3>
                            <p className="desc">{item.description || "No description provided."}</p>
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
    );
};

export default Home;
