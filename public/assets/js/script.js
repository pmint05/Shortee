const pasteBtn = document.querySelector("#paste-btn");
const clearBtn = document.querySelector("#clear-btn");
const URL__FORM = document.querySelector("#mainForm");
const URL__INPUT = document.querySelector("#longUrl");
const shorteesList = document.querySelector("#shorteesList");
let shorteeCount = document.querySelector("#shorteeCount");
let shortees = document.querySelectorAll(".shortee");
const noShorteeTxt = document.querySelector("#noShorteeTxt");
window.onload = () => {
	if (shorteesList.children.length == 0) {
		noShorteeTxt.classList.add("show");
	}
};
function copyToClipboard(text) {
	const el = document.createElement("textarea");
	el.value = window.location.href + text;
	document.body.appendChild(el);
	el.select();
	el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
	showLog(`Copied ${text} to clipboard`);
}
function openInNewTab(text) {
	window.open(`${window.location.href}${text}`, "_blank");
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
URL__FORM.onsubmit = async (e) => {
	e.preventDefault();
	let fullURL = URL__INPUT.value.trim();
	if (validate(fullURL)) {
		var http = new XMLHttpRequest();
		http.open("POST", "/shortee", true);
		http.setRequestHeader(
			"Content-type",
			"application/x-www-form-urlencoded"
		);
		var params = "longUrl=" + encodeURIComponent(fullURL);
		http.send(params);
		http.onload = function () {
			addNewShortee(JSON.parse(http.responseText));
		};
		URL__INPUT.value = "";
	} else {
		toast({
			type: "error",
			title: "Error",
			message: "URL is invalid!",
			duration: 2000,
		});
	}
};
let addNewShortee = (data) => {
	let shorteeLength = shorteesList.children.length;
	shorteeCount.innerText = shorteeLength + 1;
	let html = `
        <li class="shortee" data-id="${data.short}">
            <div class="shorteeHeader">
                <span class="shorteeLink" onclick="copyToClipboard(this.innerText)"
                    ondblclick="openInNewTab(this.innerText)">${
						data.short
					}</span>
                <span class="shorteeBtns">
                    <ion-icon name="trash-outline" class="deleteBtn" onclick="delShortee('${
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
	shorteesList.innerHTML += html;
	noShorteeTxt.classList.remove("show");
};
let validate = (url) => {
	return (
		/^(http|https):\/\/[^ "]+$/.test(url) &&
		url.indexOf(location.href) == -1
	);
};
let log = document.querySelector("#log");
let showLog = (text) => {
	toast({
		type: "success",
		title: "Success",
		message: text,
		duration: 2000,
	});
};
let delShortee = (id) => {
	let http = new XMLHttpRequest();
	http.open("POST", "/delShortee", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	let params = "shortee=" + id;
	http.send(params);
	http.onload = () => {};
	let el = document.querySelector(`[data-id="${id}"]`);
	if (el) {
		el.remove();
		shorteeCount.innerText = shorteesList.children.length;
		if (shorteesList.children.length == 0) {
			noShorteeTxt.classList.add("show");
		} else {
			noShorteeTxt.classList.remove("show");
		}
		toast({
			type: "success",
			title: "Success",
			message: "Delete Successfully!",
			duration: 1000,
		});
	}
};
