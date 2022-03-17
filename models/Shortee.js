const { initializeApp } = require("firebase/app");
const {
	getDatabase,
	ref,
	get,
	set,
	update,
	push,
	onValue,
	remove,
} = require("firebase/database");
const shortId = require("shortid");
const firebaseConfig = {
	apiKey: "AIzaSyDAhr0Ftntn4Ye0-Me364VKrxZ9hP-fbtw",
	authDomain: "shortee-rhinzo.firebaseapp.com",
	databaseURL:
		"https://shortee-rhinzo-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "shortee-rhinzo",
	storageBucket: "shortee-rhinzo.appspot.com",
	messagingSenderId: "466566338975",
	appId: "1:466566338975:web:11b2b9528ef5a46dce85aa",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function Shortee(full) {
	let id = shortId.generate();
	const data = {
		full: full,
		short: id,
		clicks: 0,
		time: new Date().toLocaleString(),
	};
	const postListRef = ref(db, "shortees/" + id);
	set(postListRef, data);
	return data;
}
let getShortees = async () => {
	let data;
	await get(ref(db, "/shortees"))
		.then((snapshot) => {
			if (snapshot.exists()) {
				data = snapshot.val();
			} else {
				data = [];
			}
		})
		.catch((error) => {
			return "Error: " + error;
		});
	return data;
};
let getShortee = async (shortee) => {
	let data;
	await get(ref(db, "/shortees/" + shortee))
		.then((snapshot) => {
			if (snapshot.exists()) {
				data = snapshot.val();
			} else {
				data = null;
			}
		})
		.catch((error) => {
			return "Error: " + error;
		});
	return data;
};
let saveShortee = async (data) => {
	const updates = {};
	updates["/shortees/" + data.short + "/clicks"] = data.clicks;
	return await update(ref(db), updates);
};
let delShortee = async (id) => {
	const shortee = ref(db, "shortees/" + id);
	return await remove(shortee);
};
module.exports = {
	getShortees: getShortees,
	getShortee: getShortee,
	saveShortee: saveShortee,
	Shortee: Shortee,
	delShortee: delShortee,
};
