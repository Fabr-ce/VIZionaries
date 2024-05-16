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
				<Route path="/t/:teamId" element={<Player />} />
				<Route path="/p/:position" element={<Player />} />
				<Route path="/r/:playerId" element={<Player />} />
				<Route path="/tr/:teamId/:playerId" element={<Player />} />
				<Route path="/pr/:position/:playerId" element={<Player />} />
				<Route path="/tp/:teamId/:position" element={<Player />} />
				<Route path="/tpr/:teamId/:position/:playerId" element={<Player />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
