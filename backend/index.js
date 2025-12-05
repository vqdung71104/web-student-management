const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Student = require('./Student');

const app = express();
const PORT = 5000;

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
  .then(() => console.log("Đã kết nối MongoDB thành công"))
  .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Student Management API' });
});

// API GET danh sách học sinh
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
    try{
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    }catch(e){
        res.status(500).json({ error: e.message });
    }
});

// API GET học sinh theo ID
app.get('/api/students/:id', async (req, res) => {
  try {
    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid student ID format" });
    }
    
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error("Error getting student:", err);
    res.status(500).json({ error: err.message });
  }
});

// API PUT cập nhật học sinh
app.put('/api/students/:id', async (req, res) => {
  try {
    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid student ID format" });
    }
    
    const updatedStu = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStu) {
      return res.status(404).json({ error: "Student not found" });
    }
    console.log("Updated student:", updatedStu);
    res.json(updatedStu);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(400).json({ error: err.message });
  }
});

//API DELETE học sinh
app.delete('/api/students/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const deleted = await Student.findByIdAndDelete(id);
    if(!deleted){
      return res.status(404).json({ error: "Student not found" });
    }  
    res.json({message: "Đã xóa học sinh: " + deleted.name});
  } catch(err){
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
