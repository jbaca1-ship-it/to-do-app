import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from './TaskItem';
import { Loader2, ClipboardList } from 'lucide-react';
import './TaskList.css';

function SortableTaskItem({ 
  task, 
  category, 
  onToggle, 
  onDelete, 
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskItem
        task={task}
        category={category}
        onToggle={onToggle}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onAddSubtask={onAddSubtask}
        onToggleSubtask={onToggleSubtask}
        onDeleteSubtask={onDeleteSubtask}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function SortableTaskList({
  tasks,
  categories,
  loading,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onReorder,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  const getCategoryById = (categoryId) => {
    return categories?.find(cat => cat.id === categoryId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
      onReorder(reorderedTasks);
    }
  };

  if (loading) {
    return (
      <div className="task-list-empty">
        <Loader2 className="spinner" size={32} />
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <ClipboardList size={48} strokeWidth={1.5} />
        <h3>No tasks yet</h3>
        <p>Add your first task above to get started!</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="task-list">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              category={getCategoryById(task.categoryId)}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onAddSubtask={onAddSubtask}
              onToggleSubtask={onToggleSubtask}
              onDeleteSubtask={onDeleteSubtask}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

