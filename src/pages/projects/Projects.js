import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import {
  addProjectMember,
  createProject,
  getMyProjects,
  getProjectMembers,
} from "../../api/projectApi";
import { createBoard, getBoardsByProject } from "../../api/boardApi";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [boards, setBoards] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [boardTitle, setBoardTitle] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const loadProjects = async () => {
    try {
      const data = await getMyProjects();
      setProjects(data);
      if (!selectedProjectId && data.length) {
        setSelectedProjectId(String(data[0].id));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    }
  };

  const loadProjectDetails = async (projectId) => {
    if (!projectId) {
      setBoards([]);
      setMembers([]);
      return;
    }
    try {
      const [boardRows, memberRows] = await Promise.all([
        getBoardsByProject(projectId),
        getProjectMembers(projectId),
      ]);
      setBoards(boardRows);
      setMembers(memberRows);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project details");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadProjectDetails(selectedProjectId);
  }, [selectedProjectId]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createProject(projectForm);
      setProjectForm({ name: "", description: "" });
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setError("");
    try {
      await createBoard(selectedProjectId, boardTitle);
      setBoardTitle("");
      await loadProjectDetails(selectedProjectId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create board");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setError("");
    try {
      await addProjectMember(selectedProjectId, memberEmail);
      setMemberEmail("");
      await loadProjectDetails(selectedProjectId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <div className="d-flex wg-shell" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 bg-light wg-main">
        <Navbar title="Projects" />
        <div className="container py-4">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5>Create Project</h5>
              <form className="row g-2" onSubmit={handleCreateProject}>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Project name"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Description"
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, description: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-primary w-100" type="submit">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <label className="form-label">Select Project</label>
              <select
                className="form-select"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                <option value="">Select...</option>
                {projects.map((project) => (
                <option key={project.id} value={project.id}>
                    {project.name} - {project.owner_name || project.owner_email || "Owner"}
                </option>
              ))}
            </select>
            </div>
          </div>

          {!!selectedProjectId && (
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5>Boards</h5>
                    <form className="d-flex gap-2 mb-3" onSubmit={handleCreateBoard}>
                      <input
                        className="form-control"
                        placeholder="New board title"
                        value={boardTitle}
                        onChange={(e) => setBoardTitle(e.target.value)}
                        required
                      />
                      <button className="btn btn-outline-primary" type="submit">
                        Add
                      </button>
                    </form>
                    <ul className="list-group">
                      {boards.map((board) => (
                        <li key={board.id} className="list-group-item">
                          {board.title}
                        </li>
                      ))}
                      {!boards.length && <li className="list-group-item text-muted">No boards</li>}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5>Members</h5>
                    <form className="d-flex gap-2 mb-3" onSubmit={handleAddMember}>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Member email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        required
                      />
                      <button className="btn btn-outline-primary" type="submit">
                        Add
                      </button>
                    </form>
                    <ul className="list-group">
                      {members.map((member) => (
                        <li key={member.id} className="list-group-item">
                          {member.full_name} ({member.email}) - {member.role}
                        </li>
                      ))}
                      {!members.length && (
                        <li className="list-group-item text-muted">No members loaded</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

