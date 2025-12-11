import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './useAuth';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to tasks in real-time
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksRef, orderBy('order', 'asc'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const taskList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(taskList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Add a new task
  const addTask = useCallback(async (taskData) => {
    if (!user) return null;

    try {
      const tasksRef = collection(db, 'users', user.uid, 'tasks');
      const newTask = {
        title: taskData.title,
        description: taskData.description || '',
        completed: false,
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || null,
        categoryId: taskData.categoryId || null,
        subtasks: taskData.subtasks || [],
        order: taskData.order ?? tasks.length,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(tasksRef, newTask);
      return { id: docRef.id, ...newTask };
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
      throw err;
    }
  }, [user, tasks.length]);

  // Update a task
  const updateTask = useCallback(async (taskId, updates) => {
    if (!user) return;

    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      throw err;
    }
  }, [user]);

  // Delete a task
  const deleteTask = useCallback(async (taskId) => {
    if (!user) return;

    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      throw err;
    }
  }, [user]);

  // Toggle task completion
  const toggleComplete = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  }, [tasks, updateTask]);

  // Update task order (for drag and drop)
  const reorderTasks = useCallback(async (reorderedTasks) => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      
      reorderedTasks.forEach((task, index) => {
        const taskRef = doc(db, 'users', user.uid, 'tasks', task.id);
        batch.update(taskRef, { order: index });
      });

      await batch.commit();
    } catch (err) {
      console.error('Error reordering tasks:', err);
      setError('Failed to reorder tasks');
      throw err;
    }
  }, [user]);

  // Subtask operations
  const addSubtask = useCallback(async (taskId, subtaskTitle) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSubtask = {
      id: Date.now().toString(),
      title: subtaskTitle,
      completed: false
    };

    const updatedSubtasks = [...(task.subtasks || []), newSubtask];
    await updateTask(taskId, { subtasks: updatedSubtasks });
  }, [tasks, updateTask]);

  const toggleSubtask = useCallback(async (taskId, subtaskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    await updateTask(taskId, { subtasks: updatedSubtasks });
  }, [tasks, updateTask]);

  const deleteSubtask = useCallback(async (taskId, subtaskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);
    await updateTask(taskId, { subtasks: updatedSubtasks });
  }, [tasks, updateTask]);

  const clearError = () => setError(null);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    clearError
  };
}

