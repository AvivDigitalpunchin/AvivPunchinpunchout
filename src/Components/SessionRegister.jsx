import React from 'react';

const dummySessions = [
  {
    mentorName: 'John Doe',
    date: '2025-08-01',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    batch: 'Batch A',
    course: 'Web Development'
  },
  {
    mentorName: 'Jane Smith',
    date: '2025-08-02',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    batch: 'Batch B',
    course: 'UI/UX Design'
  },
  {
    mentorName: 'Amit Verma',
    date: '2025-08-03',
    startTime: '4:00 PM',
    endTime: '5:30 PM',
    batch: 'Batch A',
    course: 'JavaScript Advanced'
  },
  {
    mentorName: 'Fatima Khan',
    date: '2025-08-04',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    batch: 'Batch C',
    course: 'Python Basics'
  },
  {
    mentorName: 'Rajesh Mehra',
    date: '2025-08-05',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    batch: 'Batch B',
    course: 'React.js'
  }
];

function SessionRegister() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Session Register</h2>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Mentor Name</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Start Time</th>
            <th className="px-4 py-2 border">End Time</th>
            <th className="px-4 py-2 border">Batch</th>
            <th className="px-4 py-2 border">Course</th>
          </tr>
        </thead>
        <tbody>
          {dummySessions.map((session, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{session.mentorName}</td>
              <td className="px-4 py-2 border">{session.date}</td>
              <td className="px-4 py-2 border">{session.startTime}</td>
              <td className="px-4 py-2 border">{session.endTime}</td>
              <td className="px-4 py-2 border">{session.batch}</td>
              <td className="px-4 py-2 border">{session.course}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SessionRegister;
