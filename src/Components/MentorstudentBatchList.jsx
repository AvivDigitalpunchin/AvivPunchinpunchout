import React, { useEffect, useState } from "react";
import axios from "axios";

function MentorstudentBatchList() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://avivdigitalpunchinpunchoutbackend.onrender.com/mentor/batchlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBatches(res.data.batches || []);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setError("Failed to load batch list.");
      } finally { 
        setLoading(false);
      }
    }; 

    fetchBatches();
  }, []);

  // Fetch students of the selected batch
  const handleViewStudents = async (batchName) => {
    try {
      setSelectedBatch(batchName);
      setShowModal(true);
      setStudents([]); // clear previous
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://avivdigitalpunchinpunchoutbackend.onrender.com/mentor/batch/students",
        { batchName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    }
  };

  if (loading) return <div className="p-4">Loading batches...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Batch List</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">Batch Name</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {batches.length > 0 ? (
              batches.map((batch, index) => (
                <tr key={batch._id || index} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{batch.name || "—"}</td>
                  <td className="border p-2">
                    <button
                      type="button"
                      onClick={() => handleViewStudents(batch.name)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border p-2 text-center text-gray-500"
                  colSpan="3"
                >
                  No batches found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for showing students */}
      {showModal && (
        <div     style={{ backgroundColor: "rgba(0, 0, 0, 0.482)" }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-96 rounded-lg shadow-lg p-4 relative">
            <h3 className="text-lg font-semibold mb-3">
              Students in {selectedBatch}
            </h3>

            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            {students.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto">
                {students.map((student, index) => (
                  <li
                    key={student._id || index}
                    className="border-b p-2 hover:bg-gray-50"
                  >
                    {student.name || "Unnamed Student"}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-center py-4">
                No students found for this batch.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorstudentBatchList;
