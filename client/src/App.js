import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import UsersPage from "./users/pages/UsersPage";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/AuthContext";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(null);

	const login = useCallback((uid) => {
		setIsLoggedIn(true);
		setUserId(uid);
	}, []);

	const logout = useCallback(() => {
		setIsLoggedIn(false);
		setUserId(null);
	}, []);

	let routes;

	if (isLoggedIn) {
		routes = (
			<Switch>
				<Route
					path="/"
					component={UsersPage}
					exact
				/>

				<Route
					path="/:uid/places"
					component={UserPlaces}
					exact
				/>

				<Route
					path="/places/new"
					component={NewPlace}
					exact
				/>

				<Route
					path="/places/:placeId"
					component={UpdatePlace}
					exact
				/>

				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route
					path="/"
					component={UsersPage}
					exact
				/>

				<Route
					path="/:uid/places"
					component={UserPlaces}
					exact
				/>

				<Route
					path="/users/auth"
					component={Auth}
					exact
				/>
				<Redirect to="/users/auth" />
			</Switch>
		);
	}

	return <AuthContext.Provider
		value={
			{
				isLoggedIn,
				login,
				userId,
				logout,
			}
		}
	>
		<Router>
			<MainNavigation />
			<main>
				{routes}
			</main>
		</Router>
	</AuthContext.Provider>;
}

export default App;
