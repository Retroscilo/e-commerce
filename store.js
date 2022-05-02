import { atom } from "jotai";

const _productDialog = atom({
	open: false,
	data: {},
});

const _cartDialog = atom({
	open: false,
	data: {},
});

const _adminDialog = atom({
	open: false,
	choice: "",
	data: [],
});

export { _productDialog, _cartDialog, _adminDialog, _selectedCat };
