// src/context/HistoryContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('manytool-history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('manytool-history', JSON.stringify(history));
  }, [history]);

  // Automatic entry creation (keep for backward compatibility if needed)
  const addToHistory = (tool, result) => {
    const newItem = { id: Date.now(), tool, result, timestamp: new Date().toLocaleString() };
    setHistory((prev) => [newItem, ...prev].slice(0, 50));
  };

  // Manual save function (user control)
  const saveToHistory = (tool, result) => {
    const newItem = { id: Date.now(), tool, result, timestamp: new Date().toLocaleString() };
    setHistory((prev) => [newItem, ...prev].slice(0, 50));
  };

  // Individual delete function
  const deleteHistoryItem = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all history function
  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, saveToHistory, deleteHistoryItem, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);