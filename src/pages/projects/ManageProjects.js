import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { deleteProject, getMyProjects } from "../../api/projectApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ManageProjects() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (project) => {
    const ok = window.confirm(`Delete project "${project.name}"? This cannot be undone.`);
    if (!ok) return;

    setError("");
    try {
      await deleteProject(project.id);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div className="d-flex wg-shell" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 bg-light wg-main">
        <Navbar title="Manage Projects" />
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Manage Projects</h4>
            <button className="btn btn-primary" onClick={() => navigate("/projects")}>
              Go To Projects
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="alert alert-info">Loading projects...</div>}

          {!loading && !projects.length && (
            <div className="alert alert-secondary">No projects found.</div>
          )}

          <div className="row g-3">
            {projects.map((project) => (
              <div key={project.id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{project.name}</h5>
                    <p className="text-muted flex-grow-1 mb-3">
                      {project.description || "No description"}
                    </p>
                    <small className="text-muted d-block">
                      Owner: {project.owner_name || "N/A"} ({project.owner_email || "N/A"})
                    </small>
                    <small className="text-muted d-block mb-3">
                      Created:{" "}
                      {project.created_at
                        ? new Date(project.created_at).toLocaleDateString()
                        : "N/A"}
                    </small>
                    {Number(project.owner_id) === Number(user?.id) ? (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(project)}
                      >
                        Delete Project
                      </button>
                    ) : (
                      <span className="badge text-bg-secondary">Owner only action</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

