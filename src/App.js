import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AddStudent from './components/AddStudent.js';
import StudentList from './components/StudentList.js';
import UpdateButton from './components/UpdateButton.js'; // 引入更新按钮组件

const App = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null); // 用于存储选择的学生 ID
  const [showUpdateModal, setShowUpdateModal] = useState(false); // 控制模态框是否显示

  // 计算总分和平均分并排序学生
  const calculateTotalAndAverage = (studentsData) => {
    const updatedStudents = studentsData.map(student => {
      const total = (student.cLanguage || 0) + (student.math || 0) + (student.chinese || 0);
      const average = total / 3;
      return { ...student, total, average };
    });

    // 排序学生，按总分从高到低排序
    updatedStudents.sort((a, b) => b.total - a.total);

    return updatedStudents;
  };

  // 使用 useCallback 来避免 fetchStudents 每次都变化
  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/students');
      const sortedStudents = calculateTotalAndAverage(response.data); // 获取并排序学生
      setStudents(sortedStudents); // 更新学生状态
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, []); // 空依赖数组，表示只有首次渲染时才会创建这个函数

  // 处理更新后的学生列表
  const handleStudentUpdated = () => {
    fetchStudents(); // 更新学生列表
  };

  // 处理更新按钮点击事件，选择要更新的学生
  const handleSelectStudentForUpdate = (studentId) => {
    setSelectedStudentId(studentId); // 设置当前选中的学生 ID
    setShowUpdateModal(true); // 显示模态框
  };

  // 关闭模态框
  const closeModal = () => {
    setShowUpdateModal(false);
    setSelectedStudentId(null); // 清空选中的学生 ID
  };

  useEffect(() => {
    fetchStudents(); // 初始化时加载学生
  }, [fetchStudents]); // 添加 fetchStudents 为依赖

  return (
    <div>
      <h1 align="center">学生管理系统</h1>
      <AddStudent onStudentAdded={fetchStudents} /> {/* 传递 fetchStudents 作为回调 */}
      <StudentList
        students={students}
        onDeleteStudent={fetchStudents}
        onStudentUpdated={handleStudentUpdated} // 删除时也更新
        onSelectStudentForUpdate={handleSelectStudentForUpdate} // 传递选中学生的处理函数
      />
      {/* 如果选中学生并且需要显示模态框 */}
      {showUpdateModal && selectedStudentId && (
        <UpdateButton
          studentId={selectedStudentId}
          onStudentUpdated={handleStudentUpdated}
          closeModal={closeModal} // 传递关闭模态框的函数
        />
      )}
    </div>
  );
};

export default App;
