import MockAdapter from "axios-mock-adapter";

export interface MockRule {
	register: (mock: MockAdapter) => void;
}