// components/AssignmentUpload.js

import { useState } from 'react';
import axios from 'axios';

const AssignmentUpload = ({ courseId }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId);

    try {
      await axios.post('/api/assignments/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Assignment uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Error uploading assignment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Upload Assignment</button>
    </form>
  );
};

export default AssignmentUpload;
