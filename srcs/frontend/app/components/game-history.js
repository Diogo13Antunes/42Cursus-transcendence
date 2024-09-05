import {callAPI} from "../utils/callApiUtils.js";

const styles = `
	.page-container {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 40px;
	}

	.tab-select {
		display: flex;
		width: 100%;
		height: 50px;
		justify-content: center;
		align-items: center;
	}

	.btn-solo-games {
		border-radius: 5px 0 0 5px;
		width: 40%;
	}
	
	.btn-tournament-games {
		border-radius: 0 5px 5px 0;
		width: 40%;
	}

	.btn-selected {
		background-color: #0056b3;
		border-color: #004494;
		transition: background-color 0.3s ease, box-shadow 0.3s ease;
	}

	.list-container {
		overflow-y: auto;
	}
`;

const getHtml = function(data) {
	const html = `
	<div class="page-container">
		<div class="tab-select">
			<button type="button" class="btn btn-primary btn-solo-games btn-selected">Solo Games</button>
			<button type="button" class="btn btn-primary btn-tournament-games">Tournament Games</button>
		</div>
		<div class="list-container">
			<div class="games-list"></div>
		</div>
	</div>
	`;
	return html;
}

export default class GameHistory extends HTMLElement {
	static observedAttributes = ["username"];

	constructor() {
		super();
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html(this.data);
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
		this.btnTournamentGames = this.html.querySelector(".btn-tournament-games");
		this.btnSoloGames = this.html.querySelector(".btn-solo-games");
		this.gamesListHtml = this.html.querySelector(".games-list");
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
		this.#getGameList();
		this.#soloGamesBtn();
		this.#tournamentsGamesBtn();
	}

	#insertGames(gameList) {
		let game = null;
		let prev_game = null;

		this.gamesListHtml.innerHTML = "";
		if (!gameList || !gameList.length) {
			this.gamesListHtml.innerHTML = '<h1>No games played yet.</h1>';
			return ;
		}
		gameList.forEach(elm => {
			game = document.createElement("div");
			game.innerHTML = 
			`<game-card
				player1="${elm.user1}"
				player1_image="${elm.user1_image}"
				player1_score="${elm.user1_score}"
				player2="${elm.user2}"
				player2_image="${elm.user2_image}"
				player2_score="${elm.user2_score}"
				is-winner="${elm.winner}"
				date="${this.#parse_date(elm.date)}"
				>
			</game-card>`;
			this.gamesListHtml.insertBefore(game, prev_game);
			prev_game = game;
		});
	}

	#insertTournaments(tournamentList) {
		let tournament = null;
		let prev_tournament = null;

		this.gamesListHtml.innerHTML = "";
		if (!tournamentList || !tournamentList.length) {
			this.gamesListHtml.innerHTML =  "<h1>No tournaments played yet.</h1>";
			return ;
		}
		tournamentList.forEach(elm => {

			console.log(elm);

			tournament = document.createElement("div");
			tournament.innerHTML = 
			`<tournament-card
				id="${elm.id}"
				name="${elm.name}"
				is-winner="${elm.is_winner}"
				date="${this.#parse_date(elm.creation_date)}";
			></tournament-card>`;
			this.gamesListHtml.insertBefore(tournament, prev_tournament);
			prev_tournament = tournament;
		});
	}

	#getGameList() {
		callAPI("GET", `http://127.0.0.1:8000/api/game/get-games/?username=${this.data.username}`, null, (res, data) => {
			if (res.ok && data)
				this.#insertGames(data.games_list);
		});
	};

	#getTournamentList() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/?username=${this.data.username}`, null, (res, data) => {
			if (res.ok && data)
				this.#insertTournaments(data.tournaments_list);
		});		
	}

	#soloGamesBtn() {
		this.btnSoloGames.addEventListener("click", () => {
			this.#setBtnFocus(this.btnSoloGames);
			this.#getGameList();
		});
	}

	#tournamentsGamesBtn() {
		this.btnTournamentGames.addEventListener("click", () => {
			this.#setBtnFocus(this.btnTournamentGames);
			this.#getTournamentList();
		});
	}

	#setBtnFocus(btnElmHtml) {
		this.btnTournamentGames.classList.remove("btn-selected");
		this.btnSoloGames.classList.remove("btn-selected");
		btnElmHtml.classList.add("btn-selected");
	}

	#parse_date(date) {
		let dm_part = date.split("T")[0]; //get the part with the day and month
		let hm_part = date.split("T")[1]; //get the part with the hour and minute
		let day = dm_part.split("-")[2];
		let month = dm_part.split("-")[1];
		let hour = hm_part.split(":")[0];
		let minute = hm_part.split(":")[1];
		let new_date = day + "/" + month + "-" + hour + ":" + minute;
		return new_date;
	}
}

customElements.define("game-history", GameHistory);
