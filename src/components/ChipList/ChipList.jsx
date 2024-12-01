import Chip from "../Chip/Chip.jsx";
import "./ChipList.scss";

function ChipList({ chipData }) {
	return (
		<ul className="chips">
			{chipData?.map((chipItem) => {
				return <Chip key={chipItem} content={chipItem} />;
			})}
		</ul>
	);
}

export default ChipList;
