import { useEffect, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import "./ButtonDropdown.scss";

function ButtonDropdown({ name, label, contextClasses, dropdownOptions }) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(label);

	useEffect(() => {
		const handleDropdown = (e) => {
			const classList = e.target.classList;
			if (isOpen && !classList.value.includes("dropdown")) {
				console.log("close");
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleDropdown);
		return () => {
			document.removeEventListener("mousedown", handleDropdown);
		};
	}, [isOpen]);

	return (
		<div className="dropdown">
			<button
				onClick={() => setIsOpen((prevState) => !prevState)}
				type="button"
				className={`btn ${contextClasses}`}
				name={name}
			>
				<span className="dropdown__label">{selectedOption}</span> <CaretDown />
			</button>

			<ul
				className={`dropdown__options dropdown__options--${
					isOpen ? "show" : "hide"
				}`}
			>
				{dropdownOptions?.map((option) => {
					return (
						<li
							key={option.value}
							className="dropdown__option"
							onClick={(e) => {
								setSelectedOption(option.label);
								setIsOpen(false);
							}}
						>
							{option.label}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default ButtonDropdown;
