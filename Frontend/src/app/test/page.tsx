"use client"

import { useState } from "react"

export default function TestPage() {
  const [state, setState] = useState("landing")

  const handleClick = () => {
    console.log("Test button clicked")
    setState("clicked")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Test Page</h1>
        <p className="mb-4">Current state: {state}</p>
        <button
          onClick={handleClick}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Test Button
        </button>
      </div>
    </div>
  )
}