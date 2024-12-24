import React, { useState } from 'react';
import axios from 'axios';
import './AddStudent.css';

const AddStudent = ({ onStudentAdded }) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [cLanguage, setCLanguage] = useState('');
  const [math, setMath] = useState('');
  const [chinese, setChinese] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      studentId,
      name,
      cLanguage: parseInt(cLanguage),
      math: parseInt(math),
      chinese: parseInt(chinese),
    };

    try {
      const response = await axios.post('http://localhost:5000/students', studentData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status !== 201) {
        throw new Error('Failed to add student');
      }

      console.log('Student added:', response.data);

      setStudentId('');
      setName('');
      setCLanguage('');
      setMath('');
      setChinese('');

      onStudentAdded();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-student-form">
      <h2 className="form-title">Add New Student</h2>
      <div className="form-group">
        <label htmlFor="studentId">学号:</label>
        <input
          id="studentId"
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="form-input"
          placeholder="Enter Student ID"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          placeholder="Enter Student Name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="cLanguage">C语言:</label>
        <input
          id="cLanguage"
          type="number"
          value={cLanguage}
          onChange={(e) => setCLanguage(e.target.value)}
          className="form-input"
          placeholder="Enter C Language Score"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="math">数学:</label>
        <input
          id="math"
          type="number"
          value={math}
          onChange={(e) => setMath(e.target.value)}
          className="form-input"
          placeholder="Enter Math Score"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="chinese">语文:</label>
        <input
          id="chinese"
          type="number"
          value={chinese}
          onChange={(e) => setChinese(e.target.value)}
          className="form-input"
          placeholder="Enter Chinese Score"
          required
        />
      </div>
      <button type="submit" className="submit-btn">Add Student</button>
    </form>
  );
};

export default AddStudent;
