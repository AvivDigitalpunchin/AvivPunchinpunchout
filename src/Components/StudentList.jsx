import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    batch: "",
    password: "",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const adminPassword = "admin123";
  const [courses, setCourses] = useState([]);
const [selectedCourse, setSelectedCourse] = useState(null);


useEffect(() => {
  fetchStudents();
  fetchCourses();
}, []);

const fetchCourses = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:4001/admin/courses",
       {headers: {
          Authorization: `Bearer ${token}`,
        },}
    );
    setCourses(res.data.data); // adjust depending on your response format
  } catch (err) {
    console.error("Failed to fetch courses:", err);
  }
};


  const fetchStudents = async () => {
    try {
         const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4001/student/all",
        {headers: {
          Authorization: `Bearer ${token}`,
        },}
      );
      setStudents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const toggleActive = async (id) => {
    try {
         const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:4001/student/toggle", {
        id,
      },{headers: {
          Authorization: `Bearer ${token}`,
        },});
      const updated = res.data.data;
      setStudents((prev) => prev.map((s) => (s._id === id ? updated : s)));
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleAddStudent = async () => {
    const { name, email, phone, course, batch, password } = newStudent;
    if (!name || !email || !password) return;

    try {
         const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:4001/student/add", {
        name,
        email,
        phone,
        course,
        batch,
        password,
        active: true,
      },{headers: {
          Authorization: `Bearer ${token}`,
        },});

      setStudents((prev) => [...prev, res.data]);
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        course: "",
        batch: "",
        password: "",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add student:", err);
    }
  };

  const handleEditStudent = async () => {
    const { _id, name, email, phone, course, batch } = editStudent;
    if (!name || !email) return;

    try {
         const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:4001/student/edit", {
        _id,
        name,
        email,
        phone,
        course,
        batch,
      },{headers: {
          Authorization: `Bearer ${token}`,
        },});

      const updated = res.data.data;
      setStudents((prev) => prev.map((s) => (s._id === _id ? updated : s)));
      setEditStudent(null);
    } catch (err) {
      console.error("Failed to update student:", err);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Student List</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Add Student
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600">
          <tr>
            <th className="px-4 py-3">SI No.</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Batch</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2">{student.phone || "-"}</td>
              <td className="px-4 py-2">{student.course || "-"}</td>
              <td className="px-4 py-2">{student.batch || "-"}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    student.active
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {student.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-2 flex gap-2 flex-wrap">
                <button
                  className="text-green-600 hover:underline"
                  onClick={() => {
                    setSelectedStudent(student);
                    setPasswordInput("");
                    setPasswordError("");
                    setPasswordVerified(false);
                  }}
                >
                  👁️
                </button>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setEditStudent({ ...student })}
                >
                  Edit
                </button>
                <button
                  className={`px-3 py-1 rounded text-white ${
                    student.active ? "bg-red-500" : "bg-green-500"
                  }`}
                  onClick={() => toggleActive(student._id)}
                >
                  {student.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Modal */}
{isModalOpen && (
  <div
    style={{ backgroundColor: "rgba(0, 0, 0, 0.482)" }}
    className="fixed inset-0 flex items-center justify-center z-50"
  >
    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Add Student</h3>

      <input
        type="text"
        placeholder="Name"
        value={newStudent.name}
        onChange={(e) =>
          setNewStudent((prev) => ({ ...prev, name: e.target.value }))
        }
        className="w-full mb-3 p-2 border border-gray-300 rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={newStudent.email}
        onChange={(e) =>
          setNewStudent((prev) => ({ ...prev, email: e.target.value }))
        }
        className="w-full mb-3 p-2 border border-gray-300 rounded"
      />

      <input
        type="text"
        placeholder="Phone"
        value={newStudent.phone}
        onChange={(e) =>
          setNewStudent((prev) => ({ ...prev, phone: e.target.value }))
        }
        className="w-full mb-3 p-2 border border-gray-300 rounded"
      />

<select
  value={newStudent.course}
  onChange={(e) => {
    const selected = courses.find((c) => c.title === e.target.value);
    setNewStudent((prev) => ({
      ...prev,
      course: e.target.value, // store course title
      batch: "", // reset batch when course changes
    }));
    setSelectedCourse(selected || null);
  }}
  className="w-full mb-3 p-2 border border-gray-300 rounded"
>
  <option value="">Select Course</option>
  {courses.map((course) => (
    <option key={course._id} value={course.title}>
      {course.title}
    </option>
  ))}
</select>

      {/* Batch Dropdown */}
      <select
        value={newStudent.batch}
        onChange={(e) =>
          setNewStudent((prev) => ({ ...prev, batch: e.target.value }))
        }
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        disabled={!selectedCourse}
      >
        <option value="">Select Batch</option>
        {selectedCourse?.batches.map((batch, idx) => (
          <option key={idx} value={batch.name}>
            {batch.name}
          </option>
        ))}
      </select>

      <input
        type="password"
        placeholder="Password"
        value={newStudent.password}
        onChange={(e) =>
          setNewStudent((prev) => ({ ...prev, password: e.target.value }))
        }
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleAddStudent}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Student
        </button>
      </div>
    </div>
  </div>
)}



      {/* Edit Modal */}
      {editStudent && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.482)" }}
          className="fixed inset-0  flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Student</h3>
            <input
              type="text"
              placeholder="Name"
              value={editStudent.name}
              onChange={(e) =>
                setEditStudent((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />

            <input
              type="email"
              placeholder="Email"
              value={editStudent.email}
              onChange={(e) =>
                setEditStudent((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />

            <input
              type="text"
              placeholder="Phone"
              value={editStudent.phone}
              onChange={(e) =>
                setEditStudent((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />

            <input
              type="text"
              placeholder="Course"
              value={editStudent.course}
              onChange={(e) =>
                setEditStudent((prev) => ({ ...prev, course: e.target.value }))
              }
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />

            <input
              type="text"
              placeholder="Batch"
              value={editStudent.batch}
              onChange={(e) =>
                setEditStudent((prev) => ({ ...prev, batch: e.target.value }))
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditStudent(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedStudent && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.482)" }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            {!passwordVerified ? (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  Enter Admin Password
                </h3>
                <input
                  type="password"
                  placeholder="Enter Admin Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
                />
                {passwordError && (
                  <div className="text-red-600 text-sm mb-2">
                    {passwordError}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (passwordInput === adminPassword) {
                        setPasswordVerified(true);
                      } else {
                        setPasswordError("Incorrect admin password");
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">Student Details</h3>
                <div className="mb-2">
                  <strong>Name:</strong> {selectedStudent.name}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {selectedStudent.email}
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {selectedStudent.phone}
                </div>
                <div className="mb-2">
                  <strong>Course:</strong> {selectedStudent.course}
                </div>
                <div className="mb-2">
                  <strong>Batch:</strong> {selectedStudent.batch}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  {selectedStudent.active ? (
                    <span className="text-green-700">Active</span>
                  ) : (
                    <span className="text-red-700">Inactive</span>
                  )}
                </div>

                {/* Show/hide password toggle */}
                <div className="mb-2">
                  <strong>Password:</strong>{" "}
                  {showPassword ? selectedStudent.password : "••••••••"}
                  <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 text-blue-600 underline text-sm"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
