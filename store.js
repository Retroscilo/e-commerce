import { atom } from "jotai";

const _productDialog = atom({
	open: false,
	data: {},
});

export { _productDialog };
