import React from "react"

// Other library related imports
import ReactDOM from "react-dom"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

// Shared
import { GlobalStyle } from "shared/styles/global-style"

// Components
import StaffApp from "staff-app/app"

// Css
import "index.css"

const Home: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <p>Engineering Test</p>
        <Link to="staff/daily-care">Staff</Link>
      </header>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home>Engineering Test</Home>} />
        <Route path="staff/*" element={<StaffApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
)
