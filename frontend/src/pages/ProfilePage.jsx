import React, { useState, useEffect } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get(`/fees/profile/${user.username}`);
        setProfile(response.data);
        setEditData(response.data);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user.username) {
      fetchProfile();
    }
  }, [user.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  if (loading)
    return (
      <div className="page-container">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="page-container">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="page-container">
        <h1>Student Profile</h1>
        {profile && (
          <section className="profile-section">
            <div className="profile-card">
              {isEditing ? (
                <div className="profile-edit-form">
                  <div className="form-group">
                    <label>Student ID</label>
                    <input type="text" value={editData.studentId} disabled />
                  </div>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Enrollment Year</label>
                    <input
                      type="text"
                      name="enrollmentYear"
                      value={editData.enrollmentYear}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Program</label>
                    <input
                      type="text"
                      name="program"
                      value={editData.program}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={editData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button onClick={handleSave} className="btn-primary">
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-view">
                  <div className="profile-item">
                    <label>Student ID</label>
                    <p>{profile.studentId}</p>
                  </div>
                  <div className="profile-item">
                    <label>Name</label>
                    <p>{profile.name}</p>
                  </div>
                  <div className="profile-item">
                    <label>Email</label>
                    <p>{profile.email}</p>
                  </div>
                  <div className="profile-item">
                    <label>Enrollment Year</label>
                    <p>{profile.enrollmentYear}</p>
                  </div>
                  <div className="profile-item">
                    <label>Program</label>
                    <p>{profile.program}</p>
                  </div>
                  <div className="profile-item">
                    <label>Phone</label>
                    <p>{profile.phone}</p>
                  </div>
                  <div className="profile-item">
                    <label>Address</label>
                    <p>{profile.address}</p>
                  </div>
                  <div className="profile-actions">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
