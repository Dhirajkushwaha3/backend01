import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/profile.css';

const Profile = () => {
    // 1. Extract 'id' from the URL (matches path="/food-partner/:id")
    const { id } = useParams(); 
    
    // 2. State management
    const [profileData, setProfileData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    
    const fileInputRef = useRef(null);
    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                    const token = localStorage.getItem('token');
                    const headers = token ? { Authorization: `Bearer ${token}` } : {};
                    const API_BASE = import.meta.env.VITE_API_BASE_URL;
                    const { data } = await axios.get(`${API_BASE}/api/food-partner/${id}`, {
                        withCredentials: true,
                        timeout: 10000,
                        headers
                    });

                const fp =data && data.foodPartner ? data.foodPartner : null;
                // Defer setting state to avoid synchronous updates inside effect
                Promise.resolve().then(() => {
                    setProfileData(fp);
                    setVideos(fp && fp.foodItems ? fp.foodItems : []);
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
                setProfileData(null);
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) return <div className="loading">Loading Partner Profile...</div>;

    // 3. Conditional rendering if data doesn't exist
    if (!profileData) return (
        <div className="error">
            <h2>Profile not found</h2>
            <p>We couldn't find a partner with ID: <span style={{color: 'red'}}>{id}</span></p>
            <button onClick={() => window.history.back()}>Go Back</button>
        </div>
    );

    return (
        <div className="pf-root">
            <header className="pf-header" style={{ display: 'flex', padding: '20px', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                <div
                    className="pf-avatar"
                    onClick={() => fileInputRef && fileInputRef.current && fileInputRef.current.click()}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px', overflow: 'hidden', cursor: 'pointer' }}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%' }} />
                    ) : profileData.avatar ? (
                        <img src={profileData.avatar} alt={profileData.name} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <span style={{ fontSize: '2rem' }}>{profileData.name.charAt(0)}</span>
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginRight: '20px' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                                const f = e.target.files && e.target.files[0];
                                setUploadError(null);
                                if (!f) return;
                                // create preview URL and revoke previous
                                const objUrl = URL.createObjectURL(f);
                                setPreviewUrl(objUrl);

                                setUploading(true);
                                try {
                                    const fd = new FormData();
                                    fd.append('avatar', f);
                                    const token = localStorage.getItem('token');
                                    const headers = token ? { Authorization: `Bearer ${token}` } : {};
                                    const API_BASE = import.meta.env.VITE_API_BASE_URL;
                                    const res = await axios.post(`${API_BASE}/api/food-partner/${id}/avatar`, fd, {
                                        withCredentials: true,
                                        timeout: 20000,
                                        headers
                                    });
                                    if (res.data && res.data.avatar) {
                                        setProfileData(prev => ({ ...prev, avatar: res.data.avatar }));
                                        // revoke preview
                                        URL.revokeObjectURL(objUrl);
                                        setPreviewUrl(null);
                                    } else {
                                        setUploadError('Upload did not return avatar URL');
                                    }
                                } catch (err) {
                                    console.error('Upload error', err);
                                    const msg = err?.response?.data?.message || err.message || 'Upload failed';
                                    setUploadError(msg);
                                    // keep preview so user can retry
                                } finally {
                                    setUploading(false);
                                    e.target.value = '';
                                }
                            }}
                    />
                    {uploadError && <div style={{ color: 'red' }}>{uploadError}</div>}
                    {uploading && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Uploading...
                        </div>
                    </div>}
                </div>
                <div className="pf-info">
                    <h1 style={{ margin: 0 }}>{profileData.name}</h1>
                    <p style={{ color: '#666' }}>{profileData.address}</p>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <span><strong>{videos.length}</strong> Dishes</span>
                        <span><strong>{profileData.totalServe || 0}</strong> Orders</span>
                    </div>
                </div>
            </header>

            <section className="pf-uploads" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '10px' }}>
                {videos.map((v) => (
                    <div key={v._id} className="pf-upload-item" style={{ position: 'relative', aspectRatio: '9/16', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                        <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()}>
                            <source src={v.video} type="video/mp4" />
                        </video>
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white', fontSize: '0.8rem', textShadow: '1px 1px 2px black' }}>
                            {v.name}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Profile;