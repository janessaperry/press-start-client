import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Collection from "./pages/Collection/Collection";
import Explore from "./pages/Explore/Explore";
import GameDetails from "./pages/GameDetails/GameDetails";
import "./App.scss";

function App() {
	const accessToken = localStorage.getItem("accessToken");

	if (!accessToken) {
		localStorage.setItem("accessToken", "mock-access-token");
	}

	return (
		<>
			<BrowserRouter
				future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
			>
				<Header />
				<Routes>
					{/* <Route path="/" element={<Collection />}></Route> */}
					<Route path="/" element={<Navigate to="/collection" />}></Route>
					<Route path="/explore" element={<Explore />}></Route>
					<Route path="/explore/:platform" element={<Explore />}></Route>
					<Route path="/collection" element={<Collection />}></Route>
					<Route path="/game-details/:gameId" element={<GameDetails />}></Route>
					<Route path="/settings" element={<GameDetails />}></Route>
				</Routes>
				<Footer />
			</BrowserRouter>
		</>
	);
}

export default App;
