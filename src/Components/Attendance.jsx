import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Attendance() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
            const token = localStorage.getItem("token");
        const res = await axios.get('http://localhost:4001/student/all',{headers: {
          Authorization: `Bearer ${token}`,
        },});
        setStudents(res.data.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const dummyAttendanceData = [
  { date: '2025-08-01', status: 'present' },
  { date: '2025-08-02', status: 'absent' },
  { date: '2025-08-03', status: 'leave' },
  { date: '2025-08-04', status: 'present' },
  { date: '2025-08-05', status: 'present' },
  { date: '2025-08-06', status: 'absent' },
  { date: '2025-08-07', status: 'leave' },
];

  const handleView = async (student) => {
  try {
    // Simulate async fetch
    const dummyAttendanceData = [
      { date: '2025-08-01', status: 'present' },
      { date: '2025-08-02', status: 'absent' },
      { date: '2025-08-03', status: 'leave' },
      { date: '2025-08-04', status: 'present' },
      { date: '2025-08-05', status: 'present' },
      { date: '2025-08-06', status: 'absent' },
      { date: '2025-08-07', status: 'leave' },
    ];

    setAttendanceData(dummyAttendanceData);
    setSelectedStudent(student);
  } catch (error) {
    console.error('Error fetching attendance:', error);
  }
};

  const closeCalendar = () => {
    setSelectedStudent(null);
    setAttendanceData([]);
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const record = attendanceData.find(
        (a) => new Date(a.date).toDateString() === date.toDateString()
      );
      if (record) {
        if (record.status === 'present') return 'bg-green-400 text-white';
        if (record.status === 'absent') return 'bg-red-500 text-white';
        if (record.status === 'leave') return 'bg-orange-400 text-white';
      }
    }
    return '';
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Student Attendance View</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">View Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => handleView(student)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Calendar Modal */}
      {selectedStudent && (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.482)'}} className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[350px]">
            <h3 className="text-lg font-bold mb-4">
              Attendance - {selectedStudent.name}
            </h3>
            <Calendar tileClassName={getTileClassName} />
            <div className="flex justify-between text-sm mt-4">
              <div><span className="inline-block w-4 h-4 bg-green-400 mr-2"></span>Present</div>
              <div><span className="inline-block w-4 h-4 bg-red-500 mr-2"></span>Absent</div>
              <div><span className="inline-block w-4 h-4 bg-orange-400 mr-2"></span>Leave</div>
            </div>
            <button
              onClick={closeCalendar}
              className="mt-6 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
