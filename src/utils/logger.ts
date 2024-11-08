class Logger {
	constructor(private prefix: string, private data: any) {
		//
	}

	with(prefix: string, data: any = {}) {
		return new Logger(`${prefix} ${this.prefix}`, { ...this.data, data });
	}

	info(message: string, data: any) {
		console.info(`INFO: ${this.prefix} ${message}`, data);
	}

	warn(message: string, data: any) {
		console.warn(`WARNING: ${this.prefix} ${message}`, data);
	}

	error(message: string, data: any) {
		console.error(`ERROR: ${this.prefix} ${message}`, data);
	}
}

export const logger = new Logger("", {});