import React from "react"
import { BrowserRouter } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.min.css"
import "./App.css"

import Routes from "./Routes"
function App({ location }) {
	return (
		<div className="app">
			<BrowserRouter>
				<Routes location={location} />
			</BrowserRouter>
		</div>
	)
}

export default App
