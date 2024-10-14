import stateManager from "../js/StateManager.js";
import onerrorEventImg from "./imageErrorUtil.js";

const componentSetup = function(component, html, styles) {
	const isPage = isCompPage(`${component.outerHTML}`);
	const compHtml = document.createElement("div");
	compHtml.innerHTML = html;
	if (styles) {
		const elmtId = `elmtId_${Math.floor(Math.random() * 100000000)}`;
		const compStyles = document.createElement("style");
		compStyles.textContent = `@scope (.${elmtId}) {${styles}}`;
		compHtml.classList.add(`${elmtId}`);
		component.appendChild(compStyles);
	}
	component.appendChild(compHtml);
	onerrorEventImg(compHtml);
	
	if (isPage)
		browserOnlineEvent(compHtml, browserOnline, browserOffline);
	
	return compHtml;
}

const isCompPage = function(elm) {
	if (elm.indexOf("page") == 1)
		return true;
	else false;
}

const browserOnlineEvent = function(html, callbackOnline, callbackOffline) {
	stateManager.addEvent("isOnline", (status) => {
		if (status)
			callbackOnline(html);
		else
			callbackOffline(html);
	});
}

const browserOnline = function(html) {

	// Just for debug pls remove
	console.log("online: ", html);
	const elm = html.querySelector(".content");
	const popup = elm.querySelector(".offline-popup");
	console.log(elm);
	if (popup)
		popup.remove();
	// elm.classList.add("back-blue");
}

const browserOffline = function(html) {

	// Just for debug pls remove
	console.log("offline: ", html);
	const elm = html.querySelector(".content");
	const popup = document.createElement("div");
	const icon = document.createElement("i");
	const test = document.createElement("div");
	test.innerHTML = `
	No Internet connection :(
		`
	test.classList.add("offline-text");
	icon.classList.add("bi", "bi-wifi-off", "offline-icon");
	popup.classList.add("offline-popup");
	popup.appendChild(icon);
	popup.appendChild(test)
	elm.appendChild(popup);
	// elm.classList.remove("back-red");
}

export default componentSetup;