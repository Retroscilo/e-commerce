import { atom } from "jotai";

const _productDialog = atom({
	open: false,
	data: {},
});

const _cartDialog = atom({
	open: false,
	data: {},
});

const _admin = atom({
	data: {}
})

export { _productDialog, _cartDialog, _admin };
