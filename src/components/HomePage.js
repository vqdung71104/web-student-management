import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddStudentForm from './AddStudentForm';
import './HomePage.css';

function HomePage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  };

  // Filter students theo thời gian thực khi searchTerm thay đổi
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) 
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleStudentAdded = (newStudent) => {
    setStudents(prevStudents => [...prevStudents, newStudent]);
    // filteredStudents sẽ tự động update qua useEffect
    
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

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa không?");
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/students/${id}`)
        .then(() => {
          setStudents(prevStudents => prevStudents.filter(student => student._id !== id));
        })
        .catch(error => {
          console.error("Lỗi khi xóa học sinh:", error);
        });
    }
  };

  
  // Sắp xếp danh sách đã được filter
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="home-page">
      <header className="App-header">
        <h1>Quản Lý Học Sinh</h1>
      </header>
      
      <AddStudentForm onStudentAdded={handleStudentAdded} />
      
      {/* Search Bar */}
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#282c34'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        {searchTerm && (
          <p style={{ color: '#666', marginTop: '10px', fontSize: '14px' }}>
            Tìm thấy {filteredStudents.length} kết quả
          </p>
        )}
      </div>
      
      <main style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Danh Sách Học Sinh</h2>
          <button 
            onClick={() => setSortAsc(prev => !prev)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0b7dda'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2196F3'}
          >
            Sắp xếp theo tên: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>
        
        {sortedStudents.length === 0 ? (
          <p>{searchTerm ? 'Không tìm thấy học sinh nào phù hợp.' : 'Chưa có học sinh nào trong danh sách.'}</p>
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
              {sortedStudents.map((student, index) => (
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
                    <button 
                      onClick={()=>handleDelete(student._id)}
                      className="delete-button"
                    >
                      Xóa
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
