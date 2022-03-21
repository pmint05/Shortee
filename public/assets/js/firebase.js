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
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();
