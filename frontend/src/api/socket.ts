import { io, type Socket } from "socket.io-client"
import config from "../config/config"

class SocketService {
  private socket: Socket | null = null
  private listeners: Map<string, Function[]> = new Map()

  connect(token: string): void {
    if (this.socket) {
      this.socket.disconnect()
    }

    this.socket = io(config.wsUrl, {
      auth: {
        token,
      },
      transports: ["websocket"],
    })

    this.socket.on("connect", () => {
      console.log("Socket connected")
    })

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected")
    })

    this.socket.on("error", (error) => {
      console.error("Socket error:", error)
    })

    // Set up listeners for different events
    this.socket.on("ticket:updated", (data) => {
      this.notifyListeners("ticket:updated", data)
    })

    this.socket.on("ticket:comment", (data) => {
      this.notifyListeners("ticket:comment", data)
    })

    this.socket.on("notification:new", (data) => {
      this.notifyListeners("notification:new", data)
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  addListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)?.push(callback)
  }

  removeListener(event: string, callback: Function): void {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event) || []
      const index = callbacks.indexOf(callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private notifyListeners(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || []
    callbacks.forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in ${event} listener:`, error)
      }
    })
  }
}

export const socketService = new SocketService()
export default socketService
