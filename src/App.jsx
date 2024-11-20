import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Library from "./pages/Library/Library";
import Explore from "./pages/Explore/Explore";
import GameDetails from "./pages/GameDetails/GameDetails";
import "./App.scss";

function App() {
	return (
		<>
			<BrowserRouter
				future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
			>
				<Header />
				<Routes>
					<Route path="/" element={<Library />}></Route>
					<Route path="/explore" element={<Explore />}></Route>
					<Route path="/explore/:platform" element={<Explore />}></Route>
					<Route path="/library" element={<Library />}></Route>
					<Route path="/game-details/:gameId" element={<GameDetails />}></Route>
					<Route path="/settings" element={<GameDetails />}></Route>
				</Routes>
				<Footer />
			</BrowserRouter>
		</>
	);
}

export default App;
