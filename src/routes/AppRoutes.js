import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import Alltasks from "../pages/tasks/Alltasks";
import CreateTasks from "../pages/tasks/CreateTasks";
import MyTasks from "../pages/tasks/MyTasks";
import Notifications from "../pages/notifications/Notifications";
import Projects from "../pages/projects/Projects";
import ManageProjects from "../pages/projects/ManageProjects";
import AdminUsers from "../pages/admin/AdminUsers";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Alltasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/create"
        element={
          <ProtectedRoute>
            <CreateTasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/my"
        element={
          <ProtectedRoute>
            <MyTasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/manage"
        element={
          <ProtectedRoute>
            <ManageProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<h2 className="text-center mt-5">404 Not Found</h2>} />
    </Routes>
  );
}
