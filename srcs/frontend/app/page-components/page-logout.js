import {redirect} from "../js/router.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";

const styles = `

.text-color {
	color: ${colors.primary_text};

}

.logout-btn {
	border-style: hidden;
	width: 100px;
	height: 50px;
	background-color: ${colors.button};
	color: ${colors.second_text};
}

.logout-btn:hover {
	background-color: ${colors.button_hover};
	color: ${colors.primary_text};
}

`;

const getHtml = function(data) {
	const html = `
	<app-header></app-header>
	<side-panel selected="logout"></side-panel>

	<div class="content content-small text-color">
		<h1>Logout</h1>
			<button type="button" class="btn btn-primary logout-btn" id="logout-submit">Logout</button>

	</div>
	`;
	return html;
}


const title = "Logout Page";

export default class PageLogout extends HTMLElement {
	static #componentName = "page-logout";

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html();
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
	}

	#styles() {
		if (styles)
			return `@scope (.${this.elmtId}) {${styles}}`;
		return null;
	}

	#html(data){
		return getHtml(data);
	}

	#render() {
		if (styles)
			this.appendChild(this.styles);
		this.appendChild(this.html);
		stateManager.setState("pageReady", true);
	}

	#scripts() {
		this.#logoutEvent();
	}

	#apiResHandlerCalback(res, data) {
		if (data.ok && res.message === "success") {
			if (stateManager.getState("isLoggedIn", true))
				stateManager.setState("isLoggedIn", false);
		}
		else {
			redirect("/");
		}
	}

	#logoutEvent() {
		const logout = this.html.querySelector("#logout-submit");
		logout.addEventListener("click", (event) => {
			callAPI("POST", "http://127.0.0.1:8000/api/auth/logout", null, this.#apiResHandlerCalback);
		});
	}
}

customElements.define(PageLogout.componentName, PageLogout);
