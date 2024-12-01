import axios from "axios";
const baseApiUrl = import.meta.env.VITE_API_URL;
const accessToken = localStorage.getItem("accessToken");

const handleAddGameToCollection = async (gameId, collectionOptions) => {
	let { gameConsole, gameFormat, gameStatus } = collectionOptions;

	if (!gameStatus) {
		gameStatus = "Want to play";
	}

	const newCollectionData = {
		gameId,
		gameConsole,
		gameFormat,
		gameStatus,
	};

	try {
		await axios.post(`${baseApiUrl}/collection/${gameId}`, newCollectionData, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	} catch (error) {
		console.error(error);
	}
};

const handlePatchUpdate = async (gameId, updateCategory, updateContent) => {
	try {
		await axios.patch(
			`${baseApiUrl}/collection/${gameId}`,
			{
				[updateCategory]: updateContent,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
	} catch (error) {
		console.error(error);
	}
};

const handleDeleteGame = async (gameId) => {
	try {
		await axios.delete(`${baseApiUrl}/collection/${gameId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	} catch (error) {
		console.error(error);
	}
};

export { handleAddGameToCollection, handlePatchUpdate, handleDeleteGame };
