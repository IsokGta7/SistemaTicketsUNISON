"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../../../contexts/AuthContext"
import { useTheme } from "../../../contexts/ThemeContext"
import { useLocation } from "react-router-dom" // Import useLocation
import { useEffect } from "react"

const Header: React.FC = () => {
  const { authStatus, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Initialize useLocation

  // Function to handle logout
  const handleLogout = () => {
    logout();
  };

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false); // Close the menu
  }, [location]);
