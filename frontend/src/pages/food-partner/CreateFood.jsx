import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [fileError, setFileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  /* ---------- VIDEO PREVIEW ---------- */
  useEffect(() => {
    if (!videoFile) {
      setVideoURL('');
      return;
    }

    const url = URL.createObjectURL(videoFile);
    setVideoURL(url);

    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  /* ---------- FILE VALIDATION ---------- */
  const onFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setVideoFile(null);
      setFileError('');
      return;
    }

    if (!file.type.startsWith('video/')) {
      setFileError('Please select a valid video file');
      setVideoFile(null);
      return;
    }

    setFileError('');
    setVideoFile(file);
  };

  /* ---------- SUBMIT ---------- */
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !videoFile || fileError) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    // 🔴 THIS IS THE CRITICAL FIX
    // Must match multer field name on backend
    formData.append('video', videoFile);
   const token = localStorage.getItem('foodPartnerToken');
       console.log(token);
    try {
      const response = await axios.post(
        'https://food-scroll-iopy.onrender.com/api/food',
        formData,{
          headers: {
            Authorization: `Bearer ${token}`  
                },
        
          withCredentials: true,
        }
    );
    

      console.log('Server Response:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Upload Error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  /* ---------- BUTTON STATE ---------- */
  const isDisabled = useMemo(
    () =>
      !name.trim() ||
      !description.trim() ||
      !videoFile ||
      !!fileError ||
      isUploading,
    [name, description, videoFile, fileError, isUploading]
  );

  /* ---------- UI ---------- */
  return (
    <div className="create-food-page">
      <form className="create-food-form" onSubmit={onSubmit}>

        {/* VIDEO INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="video/*"
          onChange={onFileChange}
        />

        <div
          className="file-dropzone"
          onClick={() => fileInputRef.current.click()}
        >
          {videoFile ? <strong>{videoFile.name}</strong> : 'Tap to upload video'}
        </div>

        {fileError && <p className="error-text">{fileError}</p>}

        {videoURL && (
          <div className="video-preview">
            <video src={videoURL} controls />
          </div>
        )}

        {/* NAME */}
        <input
          placeholder="Food Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Food Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" disabled={isDisabled}>
          {isUploading ? 'Uploading…' : 'Save Food'}
        </button>

      </form>
    </div>
  );
};

export default CreateFood;


