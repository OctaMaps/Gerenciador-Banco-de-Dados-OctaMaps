import React from "react"
import { BrowserRouter } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.min.css"
import "./App.css"

import Routes from "./Routes"

export default props => {
	return (
		<div className="app">
			<BrowserRouter>
				<Routes />
			</BrowserRouter>
		</div>
	)
}
