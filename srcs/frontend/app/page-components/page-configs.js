import { redirect } from "../js/router.js";
import stateManager from "../js/StateManager.js";
import { adjustContent } from "../utils/adjustContent.js";
import { colors } from "../js/globalStyles.js";

const styles = `

.text-color {
	color: ${colors.second_text};
}

`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="configurations"></side-panel>
		<div class="content content-small text-color">

		<h1>Page Configurations</h1>
		<p>
		Rump drumstick tri-tip alcatra. Flank ground round pastrami beef short ribs pork belly jowl. Spare ribs beef ribs andouille, frankfurter short loin shankle venison salami turducken. Beef ribs alcatra capicola shoulder pork loin sirloin biltong turkey pancetta flank pork andouille bacon. Doner hamburger shoulder tenderloin flank prosciutto corned beef. Chislic tongue doner porchetta pastrami sirloin filet mignon leberkas brisket ribeye pork chop shank cupim corned beef sausage.
		</p>
		<p>
		Rump drumstick tri-tip alcatra. Flank ground round pastrami beef short ribs pork belly jowl. Spare ribs beef ribs andouille, frankfurter short loin shankle venison salami turducken. Beef ribs alcatra capicola shoulder pork loin sirloin biltong turkey pancetta flank pork andouille bacon. Doner hamburger shoulder tenderloin flank prosciutto corned beef. Chislic tongue doner porchetta pastrami sirloin filet mignon leberkas brisket ribeye pork chop shank cupim corned beef sausage.
		</p>
	</div>
	`;
	return html;
}


const title = "Configurations";

export default class PageConfigs extends HTMLElement {
	static #componentName = "page-configs";

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
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageConfigs.componentName, PageConfigs);
