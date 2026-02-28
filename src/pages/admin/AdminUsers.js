import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { deleteUser, getAllUsers } from "../../api/adminApi";
import { AuthContext } from "../../context/AuthContext";

export default function AdminUsers() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const adminEmail = (process.env.REACT_APP_ADMIN_EMAIL || "").toLowerCase();
  const isAdmin = user?.email && user.email.toLowerCase() === adminEmail;

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const handleDelete = async (targetUser) => {
    const ok = window.confirm(`Delete user "${targetUser.full_name}" (${targetUser.email})?`);
    if (!ok) return;

    try {
      await deleteUser(targetUser.id);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="d-flex wg-shell" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 bg-light wg-main">
        <Navbar title="Admin - Users" />
        <div className="container py-4">
          <h4 className="mb-3">Manage Users</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="alert alert-info">Loading users...</div>}

          {!loading && (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => {
                    const isConfiguredAdmin =
                      String(item.email).toLowerCase() === adminEmail;
                    const isCurrentUser = Number(item.id) === Number(user?.id);

                    return (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.full_name}</td>
                        <td>{item.email}</td>
                        <td>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td>
                          {isConfiguredAdmin || isCurrentUser ? (
                            <span className="badge text-bg-secondary">Protected</span>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(item)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {!users.length && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

