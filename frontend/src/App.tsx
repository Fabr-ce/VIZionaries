import React from "react"

import { BrowserRouter, Route, Routes } from "react-router-dom"
import Player from "./Components/Player"

import "./index.css"

// playerId, position
// playerId, teamId
// position, teamId

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Player />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
