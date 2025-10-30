import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');

  const API_URL = 'https://avivdigitalpunchinpunchoutbackend.onrender.com/admin/courses'; // Change if different
  const ADD_COURSE= 'https://avivdigitalpunchinpunchoutbackend.onrender.com/admin/addcourse'

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL,{headers: {
          Authorization: `Bearer ${token}`,
        },});
      
      setCourses(response.data.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Add a new course via API
  const handleAddCourse = async (e) => {
  e.preventDefault();
  if (!newCourseTitle.trim()) return;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(ADD_COURSE, {
      title: newCourseTitle.trim(),
    },{headers: {
          Authorization: `Bearer ${token}`,
        },});

    setCourses([response.data, ...courses]); // Add new course to state
    setNewCourseTitle('');
  } catch (err) {
    console.error('Error adding course:', err);
  }
};


  const toggleActive = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`https://avivdigitalpunchinpunchoutbackend.onrender.com/admin/courses/toggle`, {
      id, // sending the ID in body
    },{headers: {
          Authorization: `Bearer ${token}`,
        },});

    setCourses((prev) =>
      prev.map((course) =>
        course._id === id ? response.data : course
      )
    );
  } catch (err) {
    console.error('Error toggling course active status:', err);
  }
};


  const openBatchModal = (course) => {
    setSelectedCourse(course);
    setShowBatchModal(true);
  };

  const handleAddBatch = async () => {
  if (!newBatchName.trim()) return;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post('https://avivdigitalpunchinpunchoutbackend.onrender.com/admin/courses/add-batch', {
      courseId: selectedCourse._id,
      batchName: newBatchName.trim(),
    },{headers: {
          Authorization: `Bearer ${token}`,
        },});

    const updatedCourse = response.data;

    const updatedCourses = courses.map((course) =>
      course._id === updatedCourse._id ? updatedCourse : course
    );

    setCourses(updatedCourses);
    setSelectedCourse(updatedCourse);
    setNewBatchName('');
    setShowAddBatchModal(false);
  } catch (err) {
    console.error('Error adding batch:', err);
  }
};


  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Course List</h2>

      {/* Add Course Form */}
      <form onSubmit={handleAddCourse} className="mb-6 bg-white p-4 rounded shadow-md">
        <div className="flex gap-4">
          <input
            type="text"
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            placeholder="Course Title"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Course
          </button>
        </div>
      </form>

      {/* Course Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600">
          <tr>
            <th className="text-left px-6 py-3">Title</th>
            <th className="text-left px-6 py-3">Status</th>
            <th className="text-left px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id} className="border-b">
              <td className="px-6 py-3">{course.title}</td>
              <td className="px-6 py-3">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    course.active
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {course.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-3">
                <button
                  className="text-blue-600 hover:underline mr-3"
                  onClick={() => openBatchModal(course)}
                >
                  View Batches
                </button>
                <button
                  className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                  onClick={() => toggleActive(course._id)}
                >
                  {course.active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Batch List Modal */}
      {showBatchModal && selectedCourse && (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.482)'}} className="fixed inset-0  flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Batches for {selectedCourse.title}</h3>
            {selectedCourse.batches.length === 0 ? (
              <p className="text-gray-500 mb-4">No batches added.</p>
            ) : (
              <ul className="mb-4">
                {selectedCourse.batches.map((batch, index) => (
                  <li key={index} className="border-b py-1">{batch.name}</li>
                ))}
              </ul>
            )}
            <div className="flex justify-between">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => setShowAddBatchModal(true)}
              >
                Add Batch
              </button>
              <button
                className="text-red-500 px-4 py-2 hover:underline"
                onClick={() => setShowBatchModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {showAddBatchModal && (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.482)'}} className="fixed inset-0  flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Add Batch</h3>
            <input
              type="text"
              value={newBatchName}
              onChange={(e) => setNewBatchName(e.target.value)}
              placeholder="Batch Name"
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddBatch}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddBatchModal(false)}
                className="text-gray-500 px-4 py-2 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseList;
