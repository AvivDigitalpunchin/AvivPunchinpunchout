import React, { useEffect, useState } from "react";
import axios from "axios";

function MentorDetails() {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:4001/mentor/datails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMentor(res.data.mentor || res.data);
      } catch (err) {
        console.error("Error fetching mentor details:", err);
        setError(err.response?.data?.message || "Failed to fetch mentor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, []);

  if (loading) return <div className="p-4">Loading mentor details...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Mentor Details</h2>

      {mentor ? (
        <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Name:</span> {mentor.name || "—"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Email:</span> {mentor.email || "—"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Course:</span> {mentor.course || "—"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Phone:</span> {mentor.phone || "—"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Joined On:</span>{" "}
            {mentor.createdAt
              ? new Date(mentor.createdAt).toLocaleDateString()
              : "—"}
          </p>
        </div>
      ) : (
        <div className="text-gray-600">No mentor details found.</div>
      )}
    </div>
  );
}

export default MentorDetails;

