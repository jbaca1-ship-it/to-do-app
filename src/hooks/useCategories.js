import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './useAuth';

const DEFAULT_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to categories in real-time
  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const categoriesRef = collection(db, 'users', user.uid, 'categories');
    const q = query(categoriesRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const categoryList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoryList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Add a new category
  const addCategory = useCallback(async (categoryData) => {
    if (!user) return null;

    try {
      const categoriesRef = collection(db, 'users', user.uid, 'categories');
      const newCategory = {
        name: categoryData.name,
        color: categoryData.color || DEFAULT_COLORS[categories.length % DEFAULT_COLORS.length],
        order: categories.length,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(categoriesRef, newCategory);
      return { id: docRef.id, ...newCategory };
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
      throw err;
    }
  }, [user, categories.length]);

  // Update a category
  const updateCategory = useCallback(async (categoryId, updates) => {
    if (!user) return;

    try {
      const categoryRef = doc(db, 'users', user.uid, 'categories', categoryId);
      await updateDoc(categoryRef, updates);
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
      throw err;
    }
  }, [user]);

  // Delete a category
  const deleteCategory = useCallback(async (categoryId) => {
    if (!user) return;

    try {
      const categoryRef = doc(db, 'users', user.uid, 'categories', categoryId);
      await deleteDoc(categoryRef);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
      throw err;
    }
  }, [user]);

  const clearError = () => setError(null);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    clearError,
    DEFAULT_COLORS
  };
}

