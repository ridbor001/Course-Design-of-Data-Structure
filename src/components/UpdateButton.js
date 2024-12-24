import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateButton.css'; // 为更新按钮单独设置样式

const UpdateButton = ({ studentId, onStudentUpdated, closeModal }) => {
  const [updatedFields, setUpdatedFields] = useState({
    cLanguage: '',
    math: '',
    chinese: '',
  });


 
useEffect(() => {
  if (!studentId) {
    console.error("Student ID is invalid or missing.");
    return;
  }

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/students/${studentId}`);
      const student = response.data;
      setUpdatedFields({
        cLanguage: student.cLanguage || '',
        math: student.math || '',
        chinese: student.chinese || '',
      });
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  fetchStudentData(); // Fetch student data when studentId is valid
}, [studentId]); // Trigger on studentId change




  const handleUpdate = async () => {
    const requestData = {
      studentId: studentId || undefined,
      updatedData: {
        cLanguage: parseInt(updatedFields.cLanguage) || undefined,
        math: parseInt(updatedFields.math) || undefined,
        chinese: parseInt(updatedFields.chinese) || undefined,
      },
    };

    try {
      const response = await axios.put(`http://localhost:5000/students/${studentId}`, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Student updated:', response.data);
      onStudentUpdated(); // 更新成功后刷新列表
      closeModal(); // 关闭模态框
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };
return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>更新学生信息</h2>
        <div className="form-group">
          <label>C语言:</label>
          <input
            type="number"
            value={updatedFields.cLanguage}
            onChange={(e) =>
              setUpdatedFields({ ...updatedFields, cLanguage: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>数学:</label>
          <input
            type="number"
            value={updatedFields.math}
            onChange={(e) =>
              setUpdatedFields({ ...updatedFields, math: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>语文:</label>
          <input
            type="number"
            value={updatedFields.chinese}
            onChange={(e) =>
              setUpdatedFields({ ...updatedFields, chinese: e.target.value })
            }
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleUpdate}>
            提交更新
          </button>
          <button className="btn btn-secondary" onClick={closeModal}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateButton;
