import "./InputCheckbox.scss";

function InputCheckbox({ id, name, value, handleChange }) {
	return (
		<>
			<input
				type="checkbox"
				id={id}
				name={name}
				value={value}
				onChange={(e) => handleChange(e)}
				className="input-checkbox"
			/>
			<div className="input-checkbox__custom"></div>
			<label htmlFor={id} className="input-checkbox__label">
				{value}
			</label>
		</>
	);
}

export default InputCheckbox;
