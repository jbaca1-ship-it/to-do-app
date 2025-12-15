import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import './DatePicker.css';

export function DatePicker({ value, onChange, disabled, placeholder = 'Select date' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const containerRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Set display month based on selected value
  useEffect(() => {
    if (value) {
      setDisplayMonth(new Date(value));
    }
  }, [value]);

  const handleDateSelect = (date) => {
    // Format as YYYY-MM-DD
    const formatted = date.toISOString().split('T')[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1));
  };

  const handleToday = () => {
    const today = new Date();
    setDisplayMonth(today);
    handleDateSelect(today);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push({
        date: new Date(year, month - 1, day),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows x 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const isSelectedDate = (date) => {
    if (!value) return false;
    const selected = new Date(value);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const calendarDays = generateCalendarDays();
  const monthYear = displayMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="date-picker-container" ref={containerRef}>
      <button
        type="button"
        className={`date-picker-input ${value ? 'has-value' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Calendar size={16} className="date-picker-icon" />
        <span className="date-picker-value">
          {value ? formatDisplayDate(value) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="date-picker-popup">
          <div className="date-picker-header">
            <button
              type="button"
              className="date-picker-nav-btn"
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="date-picker-month">{monthYear}</span>
            <button
              type="button"
              className="date-picker-nav-btn"
              onClick={handleNextMonth}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="date-picker-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="date-picker-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="date-picker-days">
            {calendarDays.map((dayInfo, index) => (
              <button
                key={index}
                type="button"
                className={`date-picker-day ${
                  !dayInfo.isCurrentMonth ? 'other-month' : ''
                } ${isSelectedDate(dayInfo.date) ? 'selected' : ''} ${
                  isToday(dayInfo.date) ? 'today' : ''
                }`}
                onClick={() => handleDateSelect(dayInfo.date)}
              >
                {dayInfo.date.getDate()}
              </button>
            ))}
          </div>

          <div className="date-picker-footer">
            <button
              type="button"
              className="date-picker-today-btn"
              onClick={handleToday}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

