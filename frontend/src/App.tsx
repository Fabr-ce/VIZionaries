import React from "react"

import { BrowserRouter, Route, Routes } from "react-router-dom"
import Main from "./Components/Main"
import Player from "./Components/Player"

import "./index.css"

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Player />} />
				<Route path="/:playerId" element={<Player />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
