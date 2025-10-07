// Safe utility functions that handle errors gracefully

export function safeLocalStorage() {
  const isAvailable = (() => {
    try {
      const test = "__localStorage_test__"
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  })()

  return {
    getItem: (key: string): string | null => {
      if (!isAvailable) return null
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    setItem: (key: string, value: string): boolean => {
      if (!isAvailable) return false
      try {
        localStorage.setItem(key, value)
        return true
      } catch {
        return false
      }
    },
    removeItem: (key: string): boolean => {
      if (!isAvailable) return false
      try {
        localStorage.removeItem(key)
        return true
      } catch {
        return false
      }
    },
    clear: (): boolean => {
      if (!isAvailable) return false
      try {
        localStorage.clear()
        return true
      } catch {
        return false
      }
    },
    isAvailable,
  }
}

export function safeSessionStorage() {
  const isAvailable = (() => {
    try {
      const test = "__sessionStorage_test__"
      sessionStorage.setItem(test, test)
      sessionStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  })()

  return {
    getItem: (key: string): string | null => {
      if (!isAvailable) return null
      try {
        return sessionStorage.getItem(key)
      } catch {
        return null
      }
    },
    setItem: (key: string, value: string): boolean => {
      if (!isAvailable) return false
      try {
        sessionStorage.setItem(key, value)
        return true
      } catch {
        return false
      }
    },
    removeItem: (key: string): boolean => {
      if (!isAvailable) return false
      try {
        sessionStorage.removeItem(key)
        return true
      } catch {
        return false
      }
    },
    clear: (): boolean => {
      if (!isAvailable) return false
      try {
        sessionStorage.clear()
        return true
      } catch {
        return false
      }
    },
    isAvailable,
  }
}

export function safeNavigator() {
  return {
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    language: typeof navigator !== "undefined" ? navigator.language : "en-US",
    onLine: typeof navigator !== "undefined" ? navigator.onLine : true,
    cookieEnabled: typeof navigator !== "undefined" ? navigator.cookieEnabled : true,
    hasMediaDevices: typeof navigator !== "undefined" && "mediaDevices" in navigator,
    hasGeolocation: typeof navigator !== "undefined" && "geolocation" in navigator,
    hasServiceWorker: typeof navigator !== "undefined" && "serviceWorker" in navigator,
    hasWebXR: typeof navigator !== "undefined" && "xr" in navigator,
  }
}

export function safeWindow() {
  return {
    innerWidth: typeof window !== "undefined" ? window.innerWidth : 1024,
    innerHeight: typeof window !== "undefined" ? window.innerHeight : 768,
    location: typeof window !== "undefined" ? window.location : { href: "", pathname: "/" },
    history: typeof window !== "undefined" ? window.history : null,
    isSecureContext: typeof window !== "undefined" ? window.isSecureContext : false,
  }
}

// Safe async function wrapper
export function safeAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  fallback?: R,
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      console.warn("Safe async function caught error:", error)
      if (fallback !== undefined) {
        return fallback
      }
      throw error
    }
  }
}

// Safe sync function wrapper
export function safeSync<T extends any[], R>(fn: (...args: T) => R, fallback?: R): (...args: T) => R {
  return (...args: T): R => {
    try {
      return fn(...args)
    } catch (error) {
      console.warn("Safe sync function caught error:", error)
      if (fallback !== undefined) {
        return fallback
      }
      throw error
    }
  }
}

// Check if we're in a browser environment
export const isBrowser = typeof window !== "undefined"

// Check if we're in a secure context (HTTPS)
export const isSecureContext = isBrowser && window.isSecureContext

// Check if Service Workers are supported
export const supportsServiceWorker = isBrowser && "serviceWorker" in navigator

// Check if WebXR is supported
export const supportsWebXR = isBrowser && "xr" in navigator

// Check if MediaDevices API is supported
export const supportsMediaDevices = isBrowser && "mediaDevices" in navigator

// Safe feature detection
export function detectFeatures() {
  return {
    localStorage: safeLocalStorage().isAvailable,
    sessionStorage: safeSessionStorage().isAvailable,
    serviceWorker: supportsServiceWorker,
    webXR: supportsWebXR,
    mediaDevices: supportsMediaDevices,
    webGL: isBrowser && !!document.createElement("canvas").getContext("webgl"),
    webGL2: isBrowser && !!document.createElement("canvas").getContext("webgl2"),
    touchEvents: isBrowser && "ontouchstart" in window,
    pointerEvents: isBrowser && "onpointerdown" in window,
    intersectionObserver: isBrowser && "IntersectionObserver" in window,
    resizeObserver: isBrowser && "ResizeObserver" in window,
  }
}
