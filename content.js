const expPerDays = 60;

let update = function (need, days, end) {
	days.textContent = `还需大概${need}天`;
	const date = new Date();
	date.setDate(date.getDate() + need);
	end.textContent = `预计${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}升级`;
}

let update1 = function (progress, days, end) {
	const datas = progress.textContent.split('/');
	const curr = parseInt(datas[0]);
	update(Math.ceil((parseInt(datas[1]) - curr) / expPerDays), days, end);
}

let update2 = function (item, days, end) {
	const idx = item.textContent.indexOf("还需要");
	if (idx != -1) {
		update(Math.ceil(parseInt(item.textContent.substring(idx + "还需要".length)) / expPerDays), days, end);
	}
}

const info = document.createElement("div");
info.style.cssText = 'display: flex; width: 100%; justify-content: space-between; font-size: 12px; color: #999;';
const days = document.createElement("span");
const end = document.createElement("span");
info.appendChild(days);
info.appendChild(end);

let checkProgress = function (time = 0) {
	if (time > 10) {
		console.error("[BilibiliDaysToLevelUp] Tried too many time.");
		return;
	}

	const levelInfos = document.getElementsByClassName("level-info");
	if (levelInfos && levelInfos.length >= 1) {
		// old version
		const levelInfo = levelInfos[0];
		const progresses = levelInfo.getElementsByClassName("progress");
		if (progresses && progresses.length >= 1) {
			const progress = progresses[0];
			update1(progress, days, end);
			levelInfo.after(info);

			const observer = new MutationObserver(function (mutationList, observer) {
				update1(progress, days, end);
			});
			observer.observe(progress, { childList: true });
		} else {
			setTimeout(checkProgress, 233, time + 1);
		}
	} else {
		// new version
		const avatars = document.getElementsByClassName("header-avatar-wrap");
		if (avatars && avatars.length >= 1) {
			const observer = new MutationObserver(function (mutationList, observer) {
				for (const mutation of mutationList) {
					for (const node of mutation.addedNodes) {
						if (node instanceof Element && node.classList.contains("is-bottom")) {
							const levelItem = node.getElementsByClassName("level-item__text")[0];
							levelItem.after(info);
							update2(levelItem, days, end);
							observer.disconnect();
							return;
						}
					}
				}
			});
			observer.observe(avatars[0], { childList: true });
		} else {
			setTimeout(checkProgress, 500, time + 1);
		}
	}
}
checkProgress();
