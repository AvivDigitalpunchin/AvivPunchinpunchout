import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showMentorPassword, setShowMentorPassword] = useState(false);
  const [newMentor, setNewMentor] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    password: "",
  });
  const [courses, setCourses] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
const [otp, setOtp] = useState("");
  const [editMentor, setEditMentor] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    course: "",
  });
  const [adminPassword, setAdminPassword] = useState("admin123"); // Or get it securely from env/backend
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [isVerified,setisverified]=useState(false)


  //loader
  const [loading, setLoading] = useState(false);


  //search bar
  const [searchTerm, setSearchTerm] = useState(""); 


  // Fetch mentors from backend when component mounts
useEffect(() => {
  const fetchMentors = async () => {
    try {
      setLoading(true); // show loader
      const token = localStorage.getItem("token");
      const res = await axios.get("https://avivdigitalpunchinpunchoutbackend.onrender.com/mentor/mentors",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMentors(res.data.data);

      const response = await axios.get("https://avivdigitalpunchinpunchoutbackend.onrender.com/admin/courses",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(response.data.data);
    } catch (err) {
      console.error("Failed to fetch mentors:", err);
    } finally {
      setLoading(false); // hide loader
    }
  };

  fetchMentors();
}, []);

const filteredMentors = selectedMentor
  ? mentors // show all mentors if one is selected (modal open)
  : mentors.filter((mentor) =>
      [mentor.name, mentor.email, mentor.phone, mentor.course].some((field) =>
        field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );



const toggleActive = async (_id) => {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to change this mentor's status?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, toggle it!",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.post("https://avivdigitalpunchinpunchoutbackend.onrender.com/mentor/toggle", { id: _id },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const updatedMentor = res.data.data;

    setMentors((prev) =>
      prev.map((mentor) => (mentor._id === _id ? updatedMentor : mentor))
    );

    Swal.fire("✅ Success", "Mentor status updated!", "success");
  } catch (error) {
    console.error("Error toggling mentor status:", error);
    Swal.fire("❌ Failed", "Could not toggle mentor status", "error");
  } finally {
    setLoading(false);
  }
};



const handleEditMentor = async () => {
  const { _id, name, email, phone, course } = editMentor;
  if (!name || !email || !phone || !course) {
    Swal.fire("⚠️ Missing Fields", "Please fill all the fields", "warning");
    return;
  }
  if (phone.length>10||phone.length<10) {
    Swal.fire("⚠️ Error","Phone number must be 10 digit","warning");
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.post("https://avivdigitalpunchinpunchoutbackend.onrender.com/mentor/update", {
      _id, name, email, phone, course,
    },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    const updated = res.data.data;
    setMentors((prev) =>
      prev.map((mentor) => (mentor._id === _id ? updated : mentor))
    );
    setEditModal(false);

    Swal.fire("✅ Updated", "Mentor details updated successfully!", "success");
  } catch (err) {
    console.error("Failed to update mentor:", err);
    Swal.fire("❌ Failed", "Could not update mentor", "error");
  } finally {
    setLoading(false);
  }
};


const handleAddMentor = async () => {
  const { name, email, phone, course, password } = newMentor;
  if (!name || !email || !phone || !course || !password) {
    Swal.fire("⚠️ Missing Fields", "Please fill all the fields and try again", "warning");
    return;
  }
  if (phone.length>10||phone.length<10) {
    Swal.fire("⚠️ Error","Phone number must be 10 digit","warning");
    return;
  }
  if (!isVerified) {
    Swal.fire("⚠️ Email Not Verified", "Please verify the email and try again", "warning");
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.post("https://avivdigitalpunchinpunchoutbackend.onrender.com/mentor/addmentor", {
      ...newMentor,
      active: true,
    },
  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    setMentors((prev) => [...prev, res.data]);
    setNewMentor({ name: "", email: "", phone: "", course: "", password: "" });
    setShowModal(false);
    setisverified(false)
    setNewMentor({
    name: "",
    email: "",
    phone: "",
    course: "",
    password: "",
  })
    Swal.fire("✅ Success", "Mentor added successfully!", "success");
  } catch (err) {
    console.error("Failed to add mentor:", err);
    Swal.fire("❌ Failed", "Could not add mentor. Try again!", "error");
  } finally {
    setLoading(false);
  }
};



const handleVerifyEmail = async () => {
  if (!newMentor.email) {
    Swal.fire("⚠️ Missing Email", "Please enter an email first!", "warning");
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.post("https://avivdigitalpunchinpunchoutbackend.onrender.com/admin/mentor/send-verification", {
      email: newMentor.email,
    },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    if (res.data.success) {
      setShowOtpModal(true);
      Swal.fire("📩 Sent", "Verification code sent to email!", "info");
    } else {
      Swal.fire("❌ Failed", "Could not send verification email", "error");
    }
  } catch (err) {
    console.error("Error verifying email:", err);
    Swal.fire("❌ Error", "Something went wrong!", "error");
  } finally {
    setLoading(false);
  }
};


const handleSubmitOtp = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.post("https://avivdigitalpunchinpunchoutbackend.onrender.com/admin/mentor/verify-otp", {
      email: newMentor.email,
      otp,
    },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    if (res.data.success) {
      Swal.fire("✅ Verified", "Email verified successfully!", "success");
      setisverified(true);
      setShowOtpModal(false);
    } else {
      Swal.fire("❌ Invalid", "Invalid or expired OTP", "error");
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    Swal.fire("❌ Error", "Something went wrong!", "error");
  } finally {
    setLoading(false);
  }
};





  return (
<div className="relative">
      {/* Header with Search & Add button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold" >MENTORS</h1>
        {/* Search bar left side */}
        <input
          type="text"
          placeholder="Search mentors..."
          value={searchTerm}
          defaultValue=""
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-1/3"
        />

        {/* Add Mentor button right side */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Mentor
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600">
          <tr>
            <th className="px-4 py-3">SI No.</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor, index) => (
              <tr key={mentor._id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{mentor.name}</td>
                <td className="px-4 py-2">{mentor.email}</td>
                <td className="px-4 py-2">{mentor.phone}</td>
                <td className="px-4 py-2">{mentor.course}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      mentor.active
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {mentor.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2 flex-wrap">
                  <button
                  className="text-green-600 hover:underline"
                  onClick={() => {
                    setSelectedMentor({ ...mentor });
                    setPasswordInput("");
                    setPasswordError("");
                    setPasswordVerified(false);
                  }}
                >
                  👁️
                </button>

                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    setEditMentor({
                      _id: mentor._id,
                      name: mentor.name,
                      email: mentor.email,
                      phone: mentor.phone,
                      course: mentor.course,
                    });
                    setEditModal(true);
                    console.log(editMentor);
                    
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(mentor._id)}
                  className={`px-3 py-1 rounded text-white ${
                    mentor.active ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {mentor.active ? "Deactivate" : "Activate"}
                </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center text-gray-500 py-4"
              >
                No mentors found
              </td>
            </tr>
          )}
        </tbody>
      </table>


                  {/* Create Mentor Modal */}
{showModal && (
  <div
    style={{ backgroundColor: "rgba(0, 0, 0, 0.482)" }}
    className="fixed inset-0 flex items-center justify-center z-50"
  >
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Add New Mentor</h3>

      <input
        type="text"
        placeholder="Name"
        value={newMentor.name}
        onChange={(e) =>
          setNewMentor({ ...newMentor, name: e.target.value })
        }
        className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
      />

      <div className="flex items-center mb-3">
        <input
          type="email"
          placeholder="Email"
          value={newMentor.email}
          disabled={isVerified} // ✅ disable if verified
          onChange={(e) =>
            setNewMentor({ ...newMentor, email: e.target.value })
          }
          className={`flex-1 border border-gray-300 rounded-l px-4 py-2 ${
            isVerified ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />

        {isVerified ? (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-r flex items-center justify-center">
            ✅
          </span>
        ) : (
          <button
            type="button"
            onClick={handleVerifyEmail} // function to open OTP modal
            className="px-4 py-2 bg-green-600 text-white rounded-r hover:bg-green-700"
          >
            Verify
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Phone Number"
        value={newMentor.phone}
        onChange={(e) =>
          setNewMentor({ ...newMentor, phone: e.target.value })
        }
        className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
      />

      <select
        value={newMentor.course}
        onChange={(e) =>
          setNewMentor({ ...newMentor, course: e.target.value })
        }
        className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course._id} value={course.title}>
            {course.title}
          </option>
        ))}
      </select>

      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={newMentor.password}
          onChange={(e) =>
            setNewMentor({ ...newMentor, password: e.target.value })
          }
          className="w-full border border-gray-300 rounded px-4 py-2 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-2 text-gray-600"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setisverified(false)
            setShowModal(false)
            setNewMentor({
    name: "",
    email: "",
    phone: "",
    course: "",
    password: "",
  })
          }}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleAddMentor}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Mentor
        </button>
      </div>
    </div>
  </div>
)}


      {editModal && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.482)" }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Mentor</h3>

            <input
              type="text"
              placeholder="Name"
              value={editMentor.name}
              onChange={(e) =>
                setEditMentor({ ...editMentor, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={editMentor.email}
              disabled={true}
              onChange={(e) =>
                setEditMentor({ ...editMentor, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={editMentor.phone}
              onChange={(e) =>
                setEditMentor({ ...editMentor, phone: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
            />

            <select
              value={editMentor.course}
              onChange={(e) =>
                setEditMentor({ ...editMentor, course: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditMentor}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Mentor Modal */}
      {selectedMentor && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.482)" }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
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
                    onClick={() => setSelectedMentor(null)}
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
                <h3 className="text-lg font-semibold mb-4">Mentor Details</h3>
                <div className="mb-2">
                  <strong>Name:</strong> {selectedMentor.name}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {selectedMentor.email}
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {selectedMentor.phone}
                </div>
                <div className="mb-2">
                  <strong>Course:</strong> {selectedMentor.course}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  {selectedMentor.active ? (
                    <span className="text-green-700">Active</span>
                  ) : (
                    <span className="text-red-700">Inactive</span>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      setSelectedMentor(null);
                      setShowMentorPassword(false);
                    }}
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

      {showOtpModal && (
  <div
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    className="fixed inset-0 flex items-center justify-center z-50"
  >
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h3 className="text-lg font-semibold mb-4">Enter Verification Code</h3>
      <input
        type="text"
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2 mb-3 text-center tracking-widest text-xl"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowOtpModal(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmitOtp}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Verify
        </button>
      </div>
    </div>
  </div>
)}

{loading && (
  <div className="fixed z-50 inset-0 flex items-center justify-center">
    <div className=" p-6 flex flex-col items-center">
      <img src="https://res.cloudinary.com/dbrl8pea1/image/upload/v1755344681/1488_3_iq4msu.gif" alt="Loading..." className="w-[100px] h-[100px] mb-3" />
      
    </div>
  </div>
)}


    </div>

  );
}

export default MentorList;
