let update = function (progress, days, end) {
	const datas = progress.textContent.split('/');
	const curr = parseInt(datas[0]);
	const need = Math.ceil((parseInt(datas[1]) - curr) / 60);
	days.textContent = `还需大概${need}天`;
	const date = new Date();
	date.setDate(date.getDate() + need);
	end.textContent = `预计${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}升级`;
}

const info = document.createElement("div");
info.style.cssText = 'display: flex; width: 100%; justify-content: space-between; font-size: 12px; color: #212121;';
const days = document.createElement("span");
const end = document.createElement("span");
info.appendChild(days);
info.appendChild(end);

let checkProgress = function () {
	const levelInfos = document.getElementsByClassName("level-info");
	if (levelInfos && levelInfos.length >= 1) {
		const levelInfo = levelInfos[0];
		const progresses = levelInfo.getElementsByClassName("progress");
		if (progresses && progresses.length >= 1) {
			const progress = progresses[0];
			update(progress, days, end);
			levelInfo.after(info);

			const observer = new MutationObserver(function (mutationList, observer) {
				update(progress, days, end);
			});
			observer.observe(progress, { childList: true });
		} else {
			setTimeout(checkProgress, 233);
		}
	} else {
		setTimeout(checkProgress, 233);
	}
}
checkProgress();
