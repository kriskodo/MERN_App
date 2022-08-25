import React, { useEffect, useState } from 'react';
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/HttpHook";

const UsersPage = () => {
	const [users, setUsers] = useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	useEffect(() => {
		sendRequest("http://localhost:5000/api/users").then(res => {
			setUsers(res.users);
		}).catch(err => {

		});
	}, [sendRequest]);

	return (
		<React.Fragment>
			<ErrorModal
				error={error}
				onClear={clearError}
			/>

			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}

			{!isLoading && users && (
				<UsersList users={users} />
			)}
		</React.Fragment>
	);
};

export default UsersPage;