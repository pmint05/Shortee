const { async } = require("@firebase/util");
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
const {
	getFirestore,
	addDoc,
	collection,
	doc,
	setDoc,
} = require("firebase/firestore");
require("dotenv").config();
const shortId = require("shortid");
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	databaseURL: process.env.DATABASE_URL,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const fireStore = getFirestore();
async function Shortee(full, uid) {
	let id = shortId.generate();
	const data = {
		full: full,
		short: id,
		clicks: 0,
		time: new Date().toLocaleString().replace(",", " -"),
	};
	const postListRef = ref(db, "users/" + uid + "/" + id);
	set(postListRef, data);
	set(ref(db, "global/" + id), {
		full: full,
		clicks: 0,
		uid: uid,
	});
	return data;
}
let getShortees = async (uid) => {
	let allShortees = await getGlobalShortees();
	let userShortees = await getUserShortees(uid);
	return { userShortees, allShortees };
};
let getGlobalShortees = () => {
	return get(ref(db, "global/")).then((snapshot) => {
		return Object.keys(snapshot.val() || {}).length;
	});
};
let getUserShortees = (uid) => {
	return get(ref(db, "users/" + uid)).then((snapshot) => {
		return snapshot.val();
	});
};
let getShortee = async (shortee) => {
	let data;
	await get(ref(db, "/global/" + shortee))
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
let saveShortee = async (data, id) => {
	const updates = {};
	updates["users/" + data.uid + "/" + id + "/clicks"] = data.clicks;
	updates["global/" + id + "/clicks"] = data.clicks;
	return await update(ref(db), updates);
};
let delShortee = async (id, uid) => {
	const shortee = ref(db, "users/" + uid + "/" + id);
	const global = ref(db, "global/" + id);
	await remove(shortee);
	await remove(global);
};
let sendFeedback = async (feedback) => {
	let feedbackId;
	await get(ref(db, "/siteInfo/feedbackId/")).then((snapshot) => {
		return (feedbackId = snapshot.val());
	});
	try {
		console.log(feedbackId);
		setDoc(doc(fireStore, "feedback", `${feedbackId}`), feedback);
		let newFeedbackId = new Number(feedbackId) + 1;
		set(ref(db, "/siteInfo/feedbackId"), newFeedbackId);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
};
let getLikes = async () => {
	return await get(ref(db, "/siteInfo/likes")).then((snapshot) => {
		return snapshot.val();
	});
};
let setLikes = async (likes) => {
	let currentLikes = await getLikes();
	let allLikes = new Number(currentLikes) + new Number(likes);
	return await set(ref(db, "/siteInfo/likes"), allLikes);
};
module.exports = {
	getShortees: getShortees,
	getShortee: getShortee,
	saveShortee: saveShortee,
	Shortee: Shortee,
	delShortee: delShortee,
	sendFeedback: sendFeedback,
	getLikes: getLikes,
	setLikes: setLikes,
};
