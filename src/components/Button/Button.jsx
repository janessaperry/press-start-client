import "./Button.scss";

function Button({
	callback,
	type,
	iconLeft,
	iconRight,
	label,
	contextClasses,
}) {
	return (
		<button
			onClick={callback}
			type={!type ? "button" : type}
			className={`btn ${contextClasses}`}
		>
			{iconLeft && iconLeft}
			{label && <span className="btn__label">{label}</span>}
			{iconRight && iconRight}
		</button>
	);
}

export default Button;
