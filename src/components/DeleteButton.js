import React from 'react';
import axios from 'axios';
import './DeleteButton.css'; // 为删除按钮单独设置样式

const DeleteButton = ({ id, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      onDelete(); // 删除成功后通知父组件刷新列表
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <button className="delete-button" onClick={handleDelete}>
      删除
    </button>
  );
};

export default DeleteButton;
