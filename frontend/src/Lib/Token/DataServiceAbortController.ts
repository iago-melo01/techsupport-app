export class DataServiceAbortController {
	private static controllers: AbortController[] = [];

	static create(): AbortController {
		const controller = new AbortController();
		this.controllers.push(controller);
		return controller;
	}

	static abortAll() {
		this.controllers.forEach((c) => c.abort());
		this.controllers = [];
	}
}
