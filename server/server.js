const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

// 使用中间件
app.use(cors());
app.use(express.json());

// 连接到 MongoDB
mongoose.connect('mongodb+srv://ridbor001:15725817321q@cluster0.syb87.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 定义 Student 模型
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true }, // 添加学号字段
  name: { type: String, required: true },
  cLanguage: { type: Number, required: true },
  math: { type: Number, required: true },
  chinese: { type: Number, required: true },
  total: Number,
  average: Number,
});

// 在保存学生成绩前自动计算总分和平均分
studentSchema.pre('save', function (next) {
  this.total = this.cLanguage + this.math + this.chinese;
  this.average = parseFloat((this.total / 3).toFixed(2)); // 保留两位小数
  next();
});

const Student = mongoose.model('Student', studentSchema);

// POST 请求处理路由 - 添加学生成绩
app.post('/students', async (req, res) => {
  try {
    const { studentId, name, cLanguage, math, chinese } = req.body;

    // 检查是否缺少必填字段
    if (!studentId || !name || cLanguage == null || math == null || chinese == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const student = new Student({ studentId, name, cLanguage, math, chinese });
    await student.save();
    res.status(201).json(student); // 返回创建的学生数据
  } catch (error) {
    if (error.code === 11000) {
      // 处理学号重复的错误
      return res.status(400).json({ error: 'Student ID must be unique' });
    }
    res.status(400).json({ error: error.message });
  }
});
app.get('/students/:id', async (req, res) => {
  const studentId = req.params.id;  // 获取传递的 studentId
  try {
    const student = await Student.findById(studentId);  // 根据 ID 查找学生
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });  // 如果没有找到学生
    }
    res.json(student);  // 返回学生数据
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET 请求处理路由 - 获取所有学生成绩
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ total: -1 }); // 按总分降序排序
    res.status(200).json(students); // 返回查询结果
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE 请求处理路由 - 删除学生成绩
app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params; // 获取 URL 中的 id 参数
    const deletedStudent = await Student.findByIdAndDelete(id); // 根据 id 删除学生

    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' }); // 如果未找到，返回 404
    }

    res.status(200).json({ message: 'Student deleted successfully', student: deletedStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 根据学号和姓名修改学生信息
// PUT 请求处理路由 - 根据学号或姓名更新学生信息

app.put('/students/:id', async (req, res) => {
  const { id } = req.params; // 获取 URL 中的 id 参数
  const { updatedData } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(updatedStudent); // 返回更新后的学生信息
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// 监听 5000 端口
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
