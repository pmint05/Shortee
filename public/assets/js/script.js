const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const pasteBtn = $("#paste-btn");
const clearBtn = $("#clear-btn");
const URL__FORM = $("#mainForm");
const URL__INPUT = $("#longUrl");
const formBtn = $("#shortUrlBtn");
const shorteesList = $("#shorteesList");
const loginBtn = $("#loginBtn");
const logoutBtn = $("#logoutBtn");
let shorteeCount = $("#shorteeCount");
let allShorteesCount = $("#allShorteesCount");
let shortees = $$(".shortee");
const noShorteeTxt = $("#noShorteeTxt");
const loadingWrapper = $("#loadingWrapper");
const confirmWrapper = $("#confirmWrapper");
const confirmHeader = $("#confirmHeader");
const confirmMessage = $("#confirmMessage");
const confirmBtnYes = $("#confirmBtnYes");
const confirmBtnNo = $("#confirmBtnNo");
const overlay = $("#overlay");
let currentUser;
const body = $("body");
const sideBar = $(".sidebar");
const toggle = $(".toggle-btn");
const searchBtn = $(".search-box");
const modeSwitch = $(".toggle-switch");
const modeText = $(".mode-text");
const shareBtn = $("#shareBtn");
const usageBtn = $("#usageBtn");
const likeBtn = $("#likeBtn");
const feedbackBtn = $("#feedbackBtn a");
const pageWrapper = $("#pageWrapper");
let localData = JSON.parse(localStorage.getItem("shortee")) || {
	isLiked: false,
	mode: "light",
};
let theme = localData.mode;
let isLiked = localData.isLiked;
let isLoaded = {
	feedback: false,
	usage: false,
};
let pageData = {};
let likeCount = 0;
$('a:not([href="/"])').onclick = (e) => {
	e.preventDefault();
};
window.onbeforeunload = (e) => {
	postLikes();
};
window.onblur = () => {
	postLikes();
};
window.onunload = () => {
	postLikes();
};
if (isLiked) {
	$('[name="heart-outline"]').name = "heart";
}
likeBtn.onclick = () => {
	if (!isLiked) {
		localData.isLiked = isLiked = true;
		localStorage.setItem("shortee", JSON.stringify(localData));
		$('[name="heart-outline"]').name = "heart";
	}
	let like = document.createElement("div");
	like.classList.add("like", "fly");
	like.innerHTML = "+1";
	$("#likesCount").appendChild(like);
	setTimeout(() => {
		like.remove();
	}, 300);
	likeCount++;
	$("#likes").innerText = new Number($("#likes").innerText) + 1;
};
shareBtn.onclick = () => {
	window.open(
		`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
		"_blank"
	);
};
feedbackBtn.onclick = () => {
	if (!isLoaded.feedback) {
		$("#pageLoadingWrapper").classList.remove("hide");
		pageContent.classList.add("hide");
		getPage("feedback");
	} else {
		pageWrapper.classList.add("open");
		overlay.classList.add("show");
		addPageData(pageData.feedback);
		FeedbackFunc();
	}
};
usageBtn.onclick = () => {
	if (!isLoaded.usage) {
		$("#pageLoadingWrapper").classList.remove("hide");
		pageContent.classList.add("hide");
		getPage("usage");
	} else {
		pageWrapper.classList.add("open");
		overlay.classList.add("show");
		addPageData(pageData.usage);
	}
};
let getPage = (page) => {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/page", true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = `page=${page}`;
	xhr.send(params);
	xhr.onload = function () {
		data = JSON.parse(xhr.responseText);
		showPage(data);
	};
};
let showPage = (data) => {
	setTimeout(() => {
		$("#pageLoadingWrapper").classList.add("hide");
		pageContent.classList.remove("hide");
		data.header == "Feedback" ? FeedbackFunc() : 0;
	}, 1000);
	addPageData(data);
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = `./assets/css/${data.header}.css`;
	link.onload = function () {};
	document.querySelector("head").appendChild(link);
	if (data.header == "Feedback") {
		pageData.feedback = data;
		isLoaded.feedback = true;
	} else {
		pageData.usage = data;
		isLoaded.usage = true;
	}
};
let addPageData = (data) => {
	let pageHeader = $("#pageHeader");
	let pageContent = $("#pageContent");
	pageHeader.innerHTML = data.header;
	pageContent.innerHTML = data.content;
	pageWrapper.classList.add("open");
	overlay.classList.add("show");
};
overlay.onclick = () => {
	overlay.classList.remove("show");
	confirmWrapper.classList.remove("show");
	pageWrapper.classList.remove("open");
};
if (theme == "dark") {
	body.classList.add("dark");
	modeText.innerHTML = "Light Mode";
} else {
	modeText.innerHTML = "Dark Mode";
	body.classList.remove("dark");
}
toggle.onclick = () => {
	sideBar.classList.toggle("close");
};
searchBtn.onclick = () => {
	sideBar.classList.remove("close");
	searchBtn.querySelector("input").focus();
};
modeSwitch.onclick = () => {
	body.classList.toggle("dark");
	if (body.classList.contains("dark")) {
		modeText.textContent = "Light Mode";
		localData.mode = "dark";
	} else {
		modeText.textContent = "Dark Mode";
		localData.mode = "light";
	}
	localStorage.setItem("shortee", JSON.stringify(localData));
};
window.onload = () => {
	hideLoginWrapper();
	if (shorteesList.children.length == 0) {
		noShorteeTxt.classList.add("show");
	}
};
var provider = new firebase.auth.GoogleAuthProvider();
loginBtn.onclick = () => {
	googleLogin();
};
logoutBtn.onclick = () => {
	logoutUser();
};
function googleLogin() {
	loadingWrapper.classList.remove("hide");
	firebase
		.auth()
		.signInWithPopup(provider)
		.then((result) => {
			hideLoginWrapper();
		})
		.catch((error) => {
			loadingWrapper.classList.add("hide");
			console.log(error);
		});
}
function logoutUser() {
	function logout() {
		loadingWrapper.classList.remove("hide");
		firebase
			.auth()
			.signOut()
			.then(() => {
				showLoginWrapper();
			})
			.catch((error) => {
				console.log(error);
			});
	}
	confirmFunc("logout", logout);
}
let checkAuthState = () => {
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			currentUser = user;
			// User is signed in.
			console.log("user signed in");
			hideLoginWrapper();
			showUserInfo(user);
			getShortees(user);
		} else {
			// No user is signed in.
			console.log("user signed out");
			showLoginWrapper();
			shorteesList.innerHTML = "";
			loadingWrapper.classList.add("hide");
		}
	});
};
checkAuthState();
function hideLoginWrapper() {
	document.querySelector("#loginWrapper").classList.add("hide");
}
function showLoginWrapper() {
	document.querySelector("#loginWrapper").classList.remove("hide");
}
function showUserInfo(user) {
	let name = document.getElementById("name");
	let avatar = document.getElementById("avatar");
	name.innerHTML = user.displayName || "Anonymous";
	if (user.photoURL) avatar.src = user.photoURL;
}
function copyToClipboard(text) {
	const el = document.createElement("textarea");
	el.value = window.location.origin + "/" + text;
	document.body.appendChild(el);
	el.select();
	el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
	showLog(`Copied ${text} to clipboard`);
}
function openInNewTab(text) {
	window.open(`/${text}`, "_blank");
}
pasteBtn.onclick = async () => {
	if (navigator.clipboard) {
		URL__INPUT.value = await navigator.clipboard.readText();
	} else {
		alert("Clipboard API not supported");
	}
};
clearBtn.onclick = () => {
	URL__INPUT.value = "";
};
URL__FORM.onsubmit = (e) => {
	e.preventDefault();
	let fullURL = URL__INPUT.value.trim();
	formBtn.classList.add("active");
	if (validate(fullURL)) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/shortee", true);
		xhr.setRequestHeader(
			"Content-type",
			"application/x-www-form-urlencoded"
		);
		var params = `longUrl=${encodeURIComponent(fullURL)}&uid=${
			currentUser.uid
		}`;
		xhr.send(params);
		xhr.onload = function () {
			addNewShortee(JSON.parse(xhr.responseText));
		};
		URL__INPUT.value = "";
		toast({
			type: "success",
			title: "Success",
			message: "Shortee created",
			duration: 1500,
		});
	} else {
		toast({
			type: "error",
			title: "Error",
			message: "URL is invalid!",
			duration: 2000,
		});
		formBtn.classList.remove("active");
	}
};
let addNewShortee = (data) => {
	formBtn.classList.remove("active");
	let shorteeLength = shorteesList.children.length;
	let html = generateHTML(data);
	shorteesList.innerHTML += html;
	shorteeCount.innerText = shorteeLength + 1;
	allShorteesCount.innerHTML = new Number(allShorteesCount.innerHTML) + 1;
	noShorteeTxt.classList.remove("show");
};
let generateHTML = (data) => {
	return `<li class="shortee" data-id="${data.short}">
            <div class="shorteeHeader">
                <span class="shorteeLink" onclick="copyToClipboard(this.innerText)"
                    ondblclick="openInNewTab(this.innerText)">${
						data.short
					}</span>
                <span class="shorteeBtns">
                    <ion-icon name="trash-outline" class="deleteBtn" onclick="handleDelShortee('${
						data.short
					}')"></ion-icon>
                </span>
            </div>
            <div class="shorteeBody">
                <code class="longLink">
                    <a href="${data.full}" target="_blank"
                        rel="noopener noreferrer">${data.full}</a>
                </code>
            </div>
            <div class="shorteeFooter">
                <span class="shorteeClicks">${data.clicks} ${
		(data.clicks > 1 && "clicks") || "click"
	}</span>
                <span class="shorteeTime">${data.time}</span>
            </div>
        </li>
    `;
};
let validate = (url) => {
	return (
		/^(http|https):\/\/[^ "]+$/.test(url) &&
		url.indexOf(window.location.origin) == -1
	);
};
let showLog = (text) => {
	toast({
		type: "success",
		title: "Success",
		message: text,
		duration: 2000,
	});
};
let handleDelShortee = (id, uid = currentUser.uid) => {
	let delShortee = () => {
		let xhr = new XMLHttpRequest();
		xhr.open("DELETE", "/delShortee", true);
		xhr.setRequestHeader(
			"Content-type",
			"application/x-www-form-urlencoded"
		);
		let params = `uid=${uid}&shortee=${id}`;
		xhr.send(params);
		xhr.onload = () => {};
		let el = document.querySelector(`[data-id="${id}"]`);
		if (el) {
			el.remove();
			shorteeCount.innerText = shorteesList.children.length;
			allShorteesCount.innerHTML =
				new Number(allShorteesCount.innerHTML) - 1;
			if (shorteesList.children.length == 0) {
				noShorteeTxt.classList.add("show");
			} else {
				noShorteeTxt.classList.remove("show");
			}
			toast({
				type: "success",
				title: "Success",
				message: "Delete Successfully!",
				duration: 1500,
			});
		}
	};
	confirmFunc("delete", delShortee);
};
let confirmFunc = (type, callback) => {
	let options = {
		logout: {
			title: "Logout",
			message: "Are you sure to sign out?",
		},
		delete: {
			title: "Delete",
			message: "Are you sure to delete this shortee?",
		},
	};
	overlay.classList.add("show");
	confirmWrapper.classList.add("show");
	confirmHeader.innerText = options[type].title;
	confirmMessage.innerText = options[type].message;
	confirmBtnNo.onclick = () => {
		confirmWrapper.classList.remove("show");
		overlay.classList.remove("show");
	};
	confirmBtnYes.onclick = () => {
		confirmWrapper.classList.remove("show");
		overlay.classList.remove("show");
		callback();
	};
};
let getShortees = (user) => {
	let http = new XMLHttpRequest();
	http.open("POST", "/shortees", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	let params = "uid=" + user.uid;
	http.send(params);
	http.onload = () => {
		if (http.responseText) {
			let data = JSON.parse(http.responseText);
			addShortees(data.userShortees);
			allShorteesCount.innerHTML = data.allShortees;
		} else {
			noShorteeTxt.classList.add("show");
			loadingWrapper.classList.add("hide");
		}
	};
};

let addShortees = (data) => {
	let sortedData = Object.keys(data || {}).sort(
		(a, b) => data[b].clicks - data[a].clicks
	);
	for (i in sortedData) {
		let html = generateHTML(data[sortedData[i]]);
		shorteesList.innerHTML += html;
	}
	if (data != undefined) {
		let shorteeLength = shorteesList.children.length;
		shorteeCount.innerText = shorteeLength;
		noShorteeTxt.classList.remove("show");
	}
    loadingWrapper.classList.add("hide");
    tippy(".shorteeLink", {
		content: "Click to copy.\nDouble click to open in new tab.",
		arrow: false,
		delay: [500, 0],
		duration: [200, 0],
		maxWidth: 150,
		placement: "bottom",
	});
	tippy(".deleteBtn", {
		content: "Delete this shortee.",
		arrow: false,
		delay: [500, 0],
		duration: [200, 0],
		placement: "bottom",
	});
};
let postLikes = () => {
	if (likeCount > 0) {
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "/likes", true);
		xhr.setRequestHeader(
			"Content-type",
			"application/x-www-form-urlencoded"
		);
		let params = "likes=" + likeCount;
		xhr.send(params);
		xhr.onload = () => {};
		likeCount = 0;
	}
};
