import React from "react"

// Other library related imports
import { Routes, Route } from "react-router-dom"

// Shared
import "shared/helpers/load-icons"

// Components
import { Header } from "staff-app/components/header/header.component"

// Pages
import { HomeBoardPage } from "staff-app/daily-care/home-board.page"
import { ActivityPage } from "staff-app/platform/activity.page"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="daily-care" element={<HomeBoardPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="*" element={<div>No Match</div>} />
      </Routes>
    </>
  )
}

export default App
