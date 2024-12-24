import React from 'react';
import DeleteButton from './DeleteButton'; // 导入删除按钮组件
import './StudentList.css';

const StudentList = ({ students, onDeleteStudent, onStudentUpdated, onSelectStudentForUpdate }) => {

  // 计算学生的总分和平均分
  const calculateTotalAndAverage = (student) => {
    const total = (student.cLanguage || 0) + (student.math || 0) + (student.chinese || 0);
    const average = total / 3;  // 假设是三个科目
    return { total, average };
  };

  // 渲染学生列表
  return (
    <div className="student-list-container">
      <h2 className="title">学生列表</h2>
      <ul className="student-list">
        {students.map((student) => {
          // 计算每个学生的总分和平均分
          const { total, average } = calculateTotalAndAverage(student);

          return (
            <li key={student._id} className="student-item">
              <div className="student-info">
                <span className="student-name">{student.name}</span>
                <span className="student-id">学号: {student.studentId}</span>
                <span className="student-grades">
                  C语言: {student.cLanguage}, 数学: {student.math}, 语文: {student.chinese}
                </span>
                <span className="student-total">总分: {total}</span>
                <span className="student-average">平均分: {average.toFixed(2)}</span> {/* 显示两位小数 */}
              </div>
              {/* 更新按钮：点击时选择该学生进行更新 */}
              <button onClick={() => onSelectStudentForUpdate(student._id)} className="update-button">
                修改
              </button>
              {/* 使用 DeleteButton 组件 */}
              <DeleteButton id={student._id} onDelete={onDeleteStudent} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StudentList;
