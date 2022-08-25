import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const activeHttpRequests = useRef([]);

	useEffect(() => {
		return () => {
			activeHttpRequests.current.forEach(abortController => {
				return abortController.abort();
			});
		};
	}, []);

	const sendRequest = useCallback(async (url, method = "GET", headers = {}, body = null) => {
		setIsLoading(true);
		// Storing an abort controller, so we can handle the case where
		// a page is changed, whilst waiting for a request to complete.
		const httpAbortController = new AbortController();
		activeHttpRequests.current.push(httpAbortController);

		try {
			const response = await fetch(url, {
				method,
				headers,
				body,
				signal: httpAbortController.signal,
			});

			const data = await response.json();

			activeHttpRequests.current = activeHttpRequests.current.filter(requestControl => requestControl !== httpAbortController);

			if (!response.ok) {
				throw new Error(data.message);
			}

			setIsLoading(false);
			return data;
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
			throw err;
		}
	}, []);

	const clearError = () => {
		setError(null);
	};

	return { isLoading, error, sendRequest, clearError };
};