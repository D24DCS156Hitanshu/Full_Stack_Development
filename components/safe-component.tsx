"use client"

import React from "react"

import { Component, type ReactNode } from "react"

interface SafeComponentProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error) => void
}

interface SafeComponentState {
  hasError: boolean
}

export class SafeComponent extends Component<SafeComponentProps, SafeComponentState> {
  constructor(props: SafeComponentProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): SafeComponentState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.warn("SafeComponent caught error:", error)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 text-center text-slate-600">
            <p>This component encountered an error and has been disabled.</p>
          </div>
        )
      )
    }

    return this.props.children
  }
}

// Hook for safe async operations
export function useSafeAsync<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = [],
): [T | null, boolean, Error | null] {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let cancelled = false

    const runAsync = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await asyncFn()
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    runAsync()

    return () => {
      cancelled = true
    }
  }, deps)

  return [data, loading, error]
}
