import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddStudentForm from './AddStudentForm';
import './HomePage.css';

function HomePage() {
  const [students, setStudents] = useState([]);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  };

  const handleStudentAdded = (newStudent) => {
    // Sử dụng functional update để tránh stale closure
    setStudents(prevStudents => [...prevStudents, newStudent]);
    
    // Highlight hàng vừa thêm
    setNewlyAddedId(newStudent._id);
    
    // Tự động bỏ highlight sau 3 giây
    setTimeout(() => {
      setNewlyAddedId(null);
    }, 3000);
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="home-page">
      <header className="App-header">
        <h1>Quản Lý Học Sinh</h1>
      </header>
      
      <AddStudentForm onStudentAdded={handleStudentAdded} />
      
      <main style={{ padding: '20px' }}>
        <h2>Danh Sách Học Sinh</h2>
        {students.length === 0 ? (
          <p>Chưa có học sinh nào trong danh sách.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#282c34', color: 'white' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Họ Tên</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Tuổi</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Lớp</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr 
                  key={student._id || index}
                  style={{ 
                    backgroundColor: student._id === newlyAddedId ? '#c8e6c9' : 'transparent',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>{student.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>{student.age}</td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>{student.class}</td>
                  <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(student._id)}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default HomePage;
