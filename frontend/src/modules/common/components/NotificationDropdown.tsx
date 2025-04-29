"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useNotifications } from "../../../contexts/NotificationContext"
import { formatDistanceToNow } from "date-fns"

interface NotificationDropdownProps {
  unreadCount: number
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ unreadCount }) => {
  const { notifications, markAsRead, markAllAsRead, refreshNotifications } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      refreshNotifications()
    }
  }, [isOpen, refreshNotifications])

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id)
  }

  return (
    <div className="ml-3 relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white relative"
      >
        <span className="sr-only">View notifications</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.description}</p>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-2">
              <Link
                to="/notifications"
                className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
