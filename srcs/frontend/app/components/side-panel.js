import {redirect} from "../js/router.js";
import stateManager from "../js/StateManager.js";
import { enSidePanelDict } from "../lang-dicts/enLangDict.js";
import { ptSidePanelDict } from "../lang-dicts/ptLangDict.js";
import { esSidePanelDict } from "../lang-dicts/esLangDict.js";

const styles = `

	.hide {
		display: none;
	}

	.side-panel {
		position: fixed;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		height: 100%;
		padding-top: 8px;
		padding-left: 5px;
		padding-right: 5px;
	}

	.side-panel > nav {
		width: 100%
	}

	.bottom-buttons {
		position: fixed;
		bottom: 0;
		border-top: 1px #dbd9d7 solid;
		padding-bottom: 8px;
	}

	button {
		display: block;
		background : transparent;
		border: 0;
		padding: 0;
		font-family: innherit;
		text-align: left;
		width: 100%;
	}

	.list-btn button {
		margin-bottom: 20px;
	}

	.link-btn button {
		margin-bottom: 10px;
	}

	.list-btn {
		width: 52px;
	}

	.list-btn .icon {
		display: inline-block;
		font-size: 22px;
		padding: 8px 14px 8px 14px;
		text-align: center;
	}

	.list-btn .icon:hover {
		background-color: #dbd9d7;
		clip-path:circle();
	}

	.side-panel button > span {
		display: inline-flex;
		align-items: center;
		gap: 15px;
	}

	/*** OPEN ***/
	.open .side-panel {
		width: 70px;
	}

	.open .bottom-buttons {
		width: 200px;
	}

	.open .list-btn button{
		margin-bottom: 12px;
	}

	.open .link-btn .icon {
		font-size: 22px;
		padding: 3px 14px 3px 14px;
	}

	.open .link-btn .icon-text {
		font-size: 14px;
	}

	.open .link-btn button:hover {
		background-color: #dbd9d7;
		border-radius: 6px;
		width: 200px;
	}

	/*** CLOSE ***/

	.close .side-panel {
		width: auto;
	}

	.close .list-btn button{
		margin-bottom: 7px;
	}

	.close #list:hover {
		background-color: #dbd9d7;
		clip-path:circle();
	}


	.close .link-btn .icon {
		font-size: 22px;
		padding: 8px 14px 8px 14px;
	}

	.close .link-btn .icon-text {
		display: none;
	}

	.close .link-btn button:hover {
		background-color: transparent;
	}

	.close .link-btn .icon:hover {
		background-color: #dbd9d7;
		border-radius: 3px;
	}
`;

const getHtml = function(data) {
	const html = `
	
	<div class="side-panel-wrapper ${data.state}">
		<aside class="side-panel">
			<nav>
				<div class="list-btn">
					<button>
						<span>
							<i class="icon bi bi-list"></i>
						</span>
					</button>
				</div>
				<div class="link-btn">
					<button id="home">
						<span>
							<i class="icon bi bi-house-door"></i>
							<span class="icon-text">${data.langDict.home}</span>
						</span>
					</button>
					<button id="profile">
						<span>
							<i class="icon bi bi-person"></i>
							<span class="icon-text">${data.langDict.profile}</span>
						</span>
					</button>
					<button id="chat">
						<span>
							<i class="icon bi bi-chat"></i>
							<span class="icon-text">${data.langDict.chat}</span>
						</span>
					</button>
					<button id="tournaments">
						<span>
							<i class="icon bi bi-trophy"></i>
							<span class="icon-text">${data.langDict.tournaments}</span>
						</span>
					</button>
					<button id="friends">
						<span>
							<i class="icon bi bi-people"></i>
							<span class="icon-text">${data.langDict.friends}</span>
						</span>
					</button>
					<button id="play">
						<span>
							<i class="icon bi bi-dpad"></i>
							<span class="icon-text">${data.langDict.play}</span>
						</span>
					</button>
					<div class="bottom-buttons">
						<button id="logout">
							<span>
								<i class="icon bi bi-power"></i>
								<span class="icon-text">${data.langDict.logout}</span>
							</span>
						</button>
						<button id="configurations">
							<span>
								<i class="icon bi bi-gear"></i>
								<span class="icon-text">${data.langDict.configurations}</span>
							</span>
						</button>
					</div>
				</div>
			<nav>
		</aside>
	</div>
	`;
	return html;
}

// Can be changed to object key:value
// key -> id element   value -> pretended route
const navigation = [
	"home",
	"profile",
	"chat",
	"tournaments",
	"logout",
	"configurations",
	"friends",
	"play"
]

const selectedIcon  = {
	home: "bi-house-door-fill",
	profile: "bi-person-fill",
	chat: "bi-chat-fill",
	tournaments: "bi-trophy-fill",
	configurations: "bi-gear-fill",
	friends: "bi-people-fill",
	play: "bi-dpad-fill"
}

const deselectedIcon = {
	home: "bi-house-door",
	profile: "bi-person",
	chat: "bi-chat",
	tournaments: "bi-trophy",
	configurations: "bi-gear",
	friends: "bi-people",
	play: "bi-dpad"
}

export default class SidePanel extends HTMLElement {
	static observedAttributes = ["selected", "state", "language"];

	constructor() {
		super()
		
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "selected") {
			this.newPage = newValue;
			this.oldPage = oldValue;
		}
		else if (name === "state")
			this.#changeState(newValue);
		if (name == "language") {
			this.data.langDict = this.#getLanguage(newValue);
			this.data.language = newValue;
		}
	}

	#getLanguage(language) {
		switch (language) {
			case "en":
				return enSidePanelDict;
			case "pt":
				return ptSidePanelDict;
			case "es":
				return esSidePanelDict;
			default:
				return enSidePanelDict;
		}
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.data.state = stateManager.getState("sidePanel");
		this.html.innerHTML = this.#html(this.data);
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
	}

	#scripts() {
		this.#changeSelectedPage(this.oldPage, this.newPage);
		this.#openClosePanel();
		this.#setupNavigationEvents();

	}

	//btnOpenClose()
	// criar uma função só de abrir e uma de fechar DRY principle
	#openClosePanel() {
		let btn = this.html.querySelector(`.list-btn > button`);
		btn.addEventListener("click", () => {
			let sidePanel = this.html.querySelector(".side-panel-wrapper");
			sidePanel.classList.toggle("close");
			sidePanel.classList.toggle("open");
			if (sidePanel.classList.contains("close"))
				stateManager.setState("sidePanel", "close");
			else
				stateManager.setState("sidePanel", "open");
		});		
	}

	#addButtonClickEvent(btnId) {
		let btn = this.html.querySelector(`#${btnId}`);
		btn.addEventListener("click", () => {
			if (btnId === "home")
				btnId = "/";
			redirect(btnId);
		});
	}

	#setupNavigationEvents() {
		navigation.forEach((elem) => {
			this.#addButtonClickEvent(elem);
		})
	}

	#changeSelectedPage(oldValue, newValue) {
		const newPage = navigation.find((elem) => elem === newValue);
		const oldPage = navigation.find((elem) => elem === oldValue);
		if (newPage === oldPage)
			return ;
		if (newPage)
			this.#changeIcon(newPage, deselectedIcon[newPage], selectedIcon[newPage]);
		if (oldPage)
			this.#changeIcon(oldPage, selectedIcon[newPage], deselectedIcon[newPage]);
	}

	#changeIcon(page, oldIconClass, newIconClass) {
		const icon = this.html.querySelector(`#${page} .icon`);
		icon.classList.remove(oldIconClass);
		icon.classList.add(newIconClass);
	}
	
	#changeState(value) {
		if (value !== "close" && value !== "open")
			return ;

		const sidePanel = this.html.querySelector(".side-panel-wrapper");
		sidePanel.classList.remove("close");
		sidePanel.classList.remove("open");
		sidePanel.classList.add(value);
		stateManager.setState("sidePanel", value);
	}
}

customElements.define("side-panel", SidePanel);