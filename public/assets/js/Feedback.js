function FeedbackFunc() {
	$("#star-1").onchange = () => {
		$(".status").innerText = "Terrible";
		$(".active").classList.remove("active");
		$(".terrible").classList.add("active");
	};
	$("#star-2").onchange = () => {
		$(".status").innerText = "Bad";
		$(".active").classList.remove("active");
		$(".bad").classList.add("active");
	};
	$("#star-3").onchange = () => {
		$(".status").innerText = "Good";
		$(".active").classList.remove("active");
		$(".good").classList.add("active");
	};
	$("#star-4").onchange = () => {
		$(".status").innerText = "Great";
		$(".active").classList.remove("active");
		$(".great").classList.add("active");
	};
	$("#star-5").onchange = () => {
		$(".status").innerText = "Amazing";
		$(".active").classList.remove("active");
		$(".amazing").classList.add("active");
	};
	$(".next__btn").onclick = () => {
		$("#feedback__content").classList.add("show");
	};
	$(".back__btn").onclick = () => {
		$("#feedback__content").classList.remove("show");
	};
	function resetForm(selector) {
		let form = document.querySelector(selector);
		if (form) {
			let inputs = form.querySelectorAll("[name][rules]");
			let textarea = form.querySelector("TEXTAREA");
			textarea.value = "";
			for (let input of inputs) {
				input.value = "";
				if (input.type === "checkbox") {
					input.checked = false;
				}
			}
		}
		$("#star-3").setAttribute("checked", true);
		$(".status").innerText = "Good";
		$(".active").classList.remove("active");
		$(".good").classList.add("active");
	}
	function submitData(data) {
		$("#feedback__done").classList.add("show");
		setTimeout(() => {
			$("#feedback__done").classList.remove("show");
		}, 1000);
		data = {
			...data,
			rate: $("input[type='radio']:checked").value,
			time: getCrrDate(),
			uid: currentUser.uid,
		};
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "/feedback");
		xhr.setRequestHeader(
			"Content-Type",
			"application/x-www-form-urlencoded"
		);
		let params = `name=${data.name}&email=${data.email}&message=${data.message}&rate=${data.rate}&time=${data.time}&uid=${data.uid}`;
		xhr.send(params);
	}
	let getCrrDate = () => {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear();
		var hh = today.getHours();
		var min = today.getMinutes();
		var sec = today.getSeconds();
		if (dd < 10) {
			dd = "0" + dd;
		}
		if (mm < 10) {
			mm = "0" + mm;
		}
		if (hh < 10) {
			hh = "0" + hh;
		}
		if (min < 10) {
			min = "0" + min;
		}
		if (sec < 10) {
			sec = "0" + sec;
		}
		today = dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min + ":" + sec;
		return today;
	};
	Validator("#feedback__form", {
		formGroupSelector: ".form-group",
		errorSelector: ".form-message",
		onsubmit: (data) => {
			submitData(data);
			resetForm("#feedback__form");
		},
	});
}
