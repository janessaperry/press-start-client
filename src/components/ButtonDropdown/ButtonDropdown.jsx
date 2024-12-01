import { useEffect, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import "./ButtonDropdown.scss";

function ButtonDropdown({
	label,
	contextClasses,
	dropdownOptions,
	handlePatchUpdate,
	handleDropdownChange,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(label);
	const dropdownRef = useRef(null);

	const handleDropdownSelection = (option) => {
		setSelectedOption(option);
		setIsOpen(false);
		handlePatchUpdate && handlePatchUpdate(option);
		handleDropdownChange && handleDropdownChange(option);
	};

	useEffect(() => {
		setSelectedOption(label);
	}, [label]);

	useEffect(() => {
		const handleDropdown = (e) => {
			if (isOpen && !dropdownRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleDropdown);
		return () => {
			document.removeEventListener("mousedown", handleDropdown);
		};
	}, [isOpen]);

	return (
		<div className="dropdown" ref={dropdownRef}>
			<button
				onClick={() => {
					setIsOpen((prevState) => !prevState);
				}}
				type="button"
				className={`btn ${contextClasses}`}
			>
				<span className="dropdown__label">{selectedOption || "Select..."}</span>{" "}
				<CaretDown />
			</button>

			<ul
				className={`dropdown__options dropdown__options--${
					isOpen ? "show" : "hide"
				}`}
			>
				{dropdownOptions?.map((option) => {
					return (
						<li
							key={option}
							className="dropdown__option"
							onClick={() => handleDropdownSelection(option)}
						>
							{option}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default ButtonDropdown;
