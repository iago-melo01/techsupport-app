let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export const TokenRefreshManager = {
	get isRefreshing() {
		return isRefreshing;
	},
	setRefreshing(value: boolean) {
		isRefreshing = value;
	},

	addSubscriber(callback: (token: string) => void) {
		refreshSubscribers.push(callback);
	},

	onRefreshed(token: string) {
		refreshSubscribers.forEach((callback) => callback(token));
		refreshSubscribers = [];
	},
};
