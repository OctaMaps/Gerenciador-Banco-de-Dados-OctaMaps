import React from "react"
import ReactDOM from "react-dom"
import ReactDOMServer from "react-dom/server"
import { BrowserRouter, Route } from "react-router-dom"

import "./index.css"
import App from "./main/App"
import * as serviceWorker from "./serviceWorker"

const Root = () => {
	return (
		<BrowserRouter>
			<Route component={App} />
		</BrowserRouter>
	)
}

ReactDOM.render(Root(), document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
