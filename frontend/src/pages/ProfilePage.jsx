import React, { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData]   = useState({});
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (!user.username) return;
    API.get(`/fees/profile/${user.username}`)
      .then((res) => { setProfile(res.data); setEditData(res.data); })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [user.username]);

  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.put(`/fees/profile/${user.username}`, editData);
      setProfile(res.data);
      setEditData(res.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile);   // revert any unsaved edits
    setIsEditing(false);
  };

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:"14px", color:"#64748b" }}>
      <div className="loading-spinner" />
      Loading...
    </div>
  );

  const fields = [
    { label:"Student ID",      key:"studentId",     disabled: true  },
    { label:"Full Name",       key:"name",          type:"text"     },
    { label:"Email Address",   key:"email",         type:"email"    },
    { label:"Phone",           key:"phone",         type:"text"     },
    { label:"Enrollment Year", key:"enrollmentYear",type:"text"     },
    { label:"Program",         key:"program",       type:"text"     },
  ];

  return (
    <>
      <h2 className="section-title">Student Profile</h2>

      {error && <div className="student-error">⚠️ {error}</div>}

      {profile && (
        <div className="profile-wrapper">

          {isEditing ? (
            <div className="profile-edit-card">
              <h3>✏️ Edit Profile</h3>

              <div className="form-row">
                {fields.map((f) => (
                  <div className="form-group" key={f.key}>
                    <label>{f.label}</label>
                    <input
                      type={f.type || "text"}
                      name={f.key}
                      value={editData[f.key] || ""}
                      onChange={handleChange}
                      disabled={!!f.disabled || saving}
                      style={f.disabled ? { background:"#f8fafc", color:"#94a3b8" } : {}}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={editData.address || ""}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="form-actions">
                <button
                  className="btn-save"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    opacity: saving ? 0.7 : 1,
                    cursor:  saving ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: "8px"
                  }}
                >
                  {saving ? (
                    <>
                      <span style={{
                        width:"13px", height:"13px",
                        border:"2px solid rgba(255,255,255,0.4)",
                        borderTopColor:"white", borderRadius:"50%",
                        display:"inline-block",
                        animation:"spin 0.7s linear infinite"
                      }} />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </button>

                <button
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>

          ) : (
            <div className="profile-info-card">
              <div className="profile-header-band">
                <div className="profile-avatar">👤</div>
                <div>
                  <h2>{profile.name || profile.studentId}</h2>
                  <p>{profile.program} · Enrolled {profile.enrollmentYear}</p>
                </div>
              </div>

              <div className="profile-fields">
                {[
                  { label:"Student ID",      value: profile.studentId      },
                  { label:"Full Name",       value: profile.name           },
                  { label:"Email Address",   value: profile.email          },
                  { label:"Phone",           value: profile.phone          },
                  { label:"Program",         value: profile.program        },
                  { label:"Enrollment Year", value: profile.enrollmentYear },
                  { label:"Address",         value: profile.address        },
                ].map((f, i) => (
                  <div className="profile-field" key={i}>
                    <span className="profile-field-label">{f.label}</span>
                    <span className="profile-field-value">{f.value || "—"}</span>
                  </div>
                ))}

                <div style={{ marginTop:"20px" }}>
                  <button className="btn-save" onClick={() => setIsEditing(true)}>
                    ✏️ Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default ProfilePage;
