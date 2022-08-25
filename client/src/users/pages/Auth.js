import React, { useContext, useState } from 'react';
import { useForm } from "../../shared/hooks/FormHook";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import "./UsersForm.css";
import "../../shared/components/FormElements/Button.css";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import { AuthContext } from "../../shared/context/AuthContext";
import { useHttpClient } from "../../shared/hooks/HttpHook";

const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm({
		email: {
			value: "",
			isValid: false,
		},
		password: {
			value: "",
			isValid: false,
		},
	}, false);

	const handleChangeMode = () => {
		if (isLoginMode) {
			setFormData({
				...formState.inputs,
				name: {
					value: "",
					isValid: false,
				},
			}, false);
		} else {
			setFormData({
				...formState.inputs,
				name: undefined,
			}, formState.inputs.email.isValid && formState.inputs.password.isValid);
		}

		setIsLoginMode(!isLoginMode);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isLoginMode) {
			try {
				const responseData = await sendRequest("http://localhost:5000/api/users/login", "POST",
					{
						"Content-Type": "application/json",
					}
					,
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
				);

				auth.login(responseData.user.id);
			} catch (err) {
				// No need to do anything, as the custom hook handles the error.
			}
		} else {
			try {
				const responseData = await sendRequest("http://localhost:5000/api/users/signup", "POST",
					{
						"Content-Type": "application/json",
					},
					JSON.stringify({
						name: formState.inputs.name.value,
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
				);

				auth.login(responseData.user.id);
			} catch (err) {
				// No need to do anything, as the custom hook handles the error.
			}
		}
	};

	return (
		<React.Fragment>
			<ErrorModal
				error={error}
				onClear={clearError}
			/>
			<Card className="center users-form">
				{isLoading && <LoadingSpinner asOverlay />}
				<form
					onSubmit={handleSubmit}
				>
					<h2>{isLoginMode ? "LOG IN" : "SIGN UP"}</h2>
					{!isLoginMode && (
						<Input
							id="name"
							element="input"
							type="text"
							placeholder="Name"
							onInput={inputHandler}
							errorText="Name is required. Please insert at least 2 characters."
							label="Name"
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(2)]}
						/>
					)}
					<Input
						id="email"
						element="input"
						type="email"
						placeholder="Email"
						onInput={inputHandler}
						errorText="Incorrect email. Please try again."
						label="Email"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
					/>

					<Input
						id="password"
						element="input"
						type="password"
						placeholder="Password"
						onInput={inputHandler}
						errorText="Incorrect password. Please try again."
						label="Password"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
					/>

					<Button
						type="submit"
						disabled={!formState.isValid}
					>
						{isLoginMode ? "LOG IN" : "SIGN UP"}
					</Button>
				</form>

				<Button
					inverse
					marginTop
					onClick={handleChangeMode}
				>
					SWITCH TO {isLoginMode ? "SIGN UP" : "LOG IN"}
				</Button>
			</Card>
		</React.Fragment>
	);
};


export default Auth;