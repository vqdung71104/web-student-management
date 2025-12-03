import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditStudent.css';

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [stuClass, setStuClass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin học sinh hiện tại
    console.log('Fetching student with ID:', id);
    axios.get(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        console.log('Student data received:', res.data);
        setName(res.data.name);
        setAge(res.data.age);
        setStuClass(res.data.class);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching student:', err);
        const errorMsg = err.response?.data?.error || err.message;
        setError('Không thể tải thông tin học sinh: ' + errorMsg);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Updating student:', { id, name, age: Number(age), class: stuClass });

    try {
      const res = await axios.put(`http://localhost:5000/api/students/${id}`, {
        name,
        age: Number(age),
        class: stuClass
      });
      console.log("Đã cập nhật:", res.data);
      alert('Cập nhật học sinh thành công!');
      // Quay về trang chủ
      navigate("/");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      const errorMsg = err.response?.data?.error || err.message;
      setError('Lỗi khi cập nhật học sinh: ' + errorMsg);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="edit-student-container">
      <div className="edit-student-form">
        <h2>Chỉnh Sửa Thông Tin Học Sinh</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Họ tên:</label>
            <input
              type="text"
              placeholder="Họ tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Tuổi:</label>
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
            <label>Lớp:</label>
            <input
              type="text"
              placeholder="Lớp"
              value={stuClass}
              onChange={(e) => setStuClass(e.target.value)}
              required
            />
          </div>
          
          <div className="button-group">
            <button type="submit" className="submit-button">
              Cập nhật
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate("/")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStudent;
