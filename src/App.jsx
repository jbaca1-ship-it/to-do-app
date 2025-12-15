import { useState } from "react";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ToastProvider } from "./components/ui/Toast";
import { useAuth } from "./hooks/useAuth";
import { useTasks } from "./hooks/useTasks";
import { useCategories } from "./hooks/useCategories";
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm } from "./components/auth/SignupForm";
import { Sidebar } from "./components/layout/Sidebar";
import { MainContent } from "./components/layout/MainContent";
import { CalendarView } from "./components/calendar/CalendarView";
import "./App.css";

function AppContent() {
  const { user, loading: authLoading, logout } = useAuth();
  const [authMode, setAuthMode] = useState("login");
  // Start with sidebar open on desktop (>1024px), closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentView, setCurrentView] = useState("list");

  const {
    tasks,
    loading: tasksLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useTasks();

  const { categories, addCategory, deleteCategory, DEFAULT_COLORS } =
    useCategories();

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth forms if not logged in
  if (!user) {
    return authMode === "login" ? (
      <LoginForm onSwitchToSignup={() => setAuthMode("signup")} />
    ) : (
      <SignupForm onSwitchToLogin={() => setAuthMode("login")} />
    );
  }

  // Main app layout
  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        onLogout={logout}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        defaultColors={DEFAULT_COLORS}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {currentView === "list" ? (
        <MainContent
          tasks={tasks}
          categories={categories}
          loading={tasksLoading}
          selectedCategory={selectedCategory}
          onAddTask={addTask}
          onToggleTask={toggleComplete}
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
          onAddSubtask={addSubtask}
          onToggleSubtask={toggleSubtask}
          onDeleteSubtask={deleteSubtask}
          onReorderTasks={reorderTasks}
          sidebarOpen={sidebarOpen}
        />
      ) : (
        <CalendarView
          tasks={tasks}
          categories={categories}
          loading={tasksLoading}
          selectedCategory={selectedCategory}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onToggleTask={toggleComplete}
          onDeleteTask={deleteTask}
          sidebarOpen={sidebarOpen}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
