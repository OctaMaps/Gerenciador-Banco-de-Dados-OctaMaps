import React from "react"

export default props => {
	const { placeholder, onChange, value } = props
	return (
		<div className="input-group">
			<div className="input-group-prepend">
				<span className="input-group-text">
					<i className="fa fa-search fa-fw" />
				</span>
			</div>
			<input
				className="form-control "
				type="text"
				name="query"
				value={value}
				placeholder={placeholder}
				onChange={onChange}
			/>
		</div>
	)
}
