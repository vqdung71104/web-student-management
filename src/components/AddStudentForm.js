import { useState } from 'react';
import axios from 'axios';
import './AddStudentForm.css';

function AddStudentForm({ onStudentAdded }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [stuClass, setStuClass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const newStu = { name, age: Number(age), class: stuClass };
    
    try {
      const res = await axios.post('http://localhost:5000/api/students', newStu);
      console.log("Đã thêm:", res.data);
      
      // Xóa nội dung form sau khi thêm thành công
      setName("");
      setAge("");
      setStuClass("");
      
      // Hiển thị thông báo thành công
      setSuccess('Thêm học sinh thành công!');
      
      // Cập nhật state students để hiển thị luôn học sinh mới
      if (onStudentAdded) {
        onStudentAdded(res.data);
      }
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error("Lỗi khi thêm:", err);
      setError('Lỗi khi thêm học sinh: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="add-student-form">
      <h2>Thêm Học Sinh Mới</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleAddStudent}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Tuổi"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Lớp"
            value={stuClass}
            onChange={(e) => setStuClass(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Thêm học sinh
        </button>
      </form>
    </div>
  );
}

export default AddStudentForm;
