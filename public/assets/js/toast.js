let toast = ({ type = "info", title = "", message = "", duration = 3000 }) => {
	const toastContainer = document.getElementById("toast");
	if (toastContainer) {
		const toast = document.createElement("div");
		toast.onclick = (e) => {
			if (e.target.closest(".toast__close")) {
				toastContainer.removeChild(toast);
				return;
			}
		};
		const icons = {
			success: '<ion-icon name="checkmark-circle"></ion-icon>',
			info: '<ion-icon name="information-circle"></ion-icon>',
			warning: '<ion-icon name="alert-circle"></ion-icon>',
			error: '<ion-icon name="close-circle"></ion-icon>',
		};
		const delay = (duration / 1000).toFixed(2);
		toast.classList.add("toast", `toast--${type}`);
		toast.style.animation = `slideInLeft 0.2s ease-in-out forwards,	slideInRight 0.2s ${delay}s ease-in-out forwards`;
		toast.innerHTML = `
					<div class="toast__icon">
						${icons[type]}
					</div>
					<div class="toast__body">
						<h3 class="toast__title">${title}</h3>
						<p class="toast__message">${message}</p>
					</div>
					<div class="toast__close">
						<ion-icon name="close"></ion-icon>
					</div>
                    <div class="toast__loading"></div>
				`;
		toastContainer.appendChild(toast);
		setTimeout(() => {
			toast.remove();
		}, duration + 1000);
		toast.querySelector(
			".toast__loading"
		).style.animation = `loadOut ${duration}ms ease-in-out forwards`;
	}
};
