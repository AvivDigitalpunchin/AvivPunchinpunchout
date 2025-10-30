import React, { useEffect, useState } from "react";
import axios from "axios";

function Review() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const dummyReviews = [
  {
    comment: "Excellent understanding of concepts and participates actively in class.",
    color: "green",
    date: "2025-08-01"
  },
  {
    comment: "Needs to improve consistency in homework submissions.",
    color: "orange",
    date: "2025-08-05"
  },
  {
    comment: "Very creative and contributes great ideas during group work.",
    color: "blue",
    date: "2025-08-08"
  },
  {
    comment: "Has been absent frequently this month, needs attention.",
    color: "red",
    date: "2025-08-10"
  }
];

  // Fetch student list
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:4001/student/all");
        setStudents(res.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Open modal & fetch reviews
  const handleViewReviews = async (student) => {
    try {
      setSelectedStudent(student);
      setReviews(dummyReviews);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Student Reviews</h2>

      {/* Students Table */}
      <table className="min-w-full border border-gray-300 bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id}>
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{student.name}</td>
              <td className="px-4 py-2 border">{student.email}</td>
              <td className="px-4 py-2 border text-center">
                <button
                  onClick={() => handleViewReviews(student)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
{/* Modal */}
{isModalOpen && (
  <div
    style={{ backgroundColor: "rgba(0, 0, 0, 0.482)" }}
    className="fixed inset-0 flex items-center justify-center z-50"
  >
    <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
      {/* Close Button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
      >
        &times;
      </button>

      {/* Student Info */}
      <h3 className="text-xl font-semibold mb-1">
        Reviews for {selectedStudent?.name}
      </h3>
      {selectedStudent?.email && (
        <p className="text-sm text-gray-500 mb-3">{selectedStudent.email}</p>
      )}

      {reviews.length > 0 ? (
        <ul className="space-y-2">
          {reviews.map((review, idx) => (
            <li
              key={idx}
              className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-start space-x-3"
            >
              {/* Color Indicator */}
              <span
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: review.color }}
              ></span>

              {/* Review Details */}
              <div>
                <p className="text-gray-800">{review.comment}</p>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No reviews found for this student.</p>
      )}
    </div>
  </div>
)}


    </div>
  );
}

export default Review;
