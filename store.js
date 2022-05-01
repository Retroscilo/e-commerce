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
	data: {},
});

const _selectedCat = atom([]);

export { _productDialog, _cartDialog, _adminDialog, _selectedCat };
