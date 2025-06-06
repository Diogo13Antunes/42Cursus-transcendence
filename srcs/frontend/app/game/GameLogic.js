import { Ball } from './Ball.js';
import { Paddle } from './Paddle.js';
import { WINNING_SCORE_PONTUATION } from './const_vars.js';

export class GameLogic {
	constructor() {
		this.ball = new Ball();
		this.paddleLeft = new Paddle("left");
		this.paddleRight = new Paddle("right");
		this.player1Score = 0;
		this.player2Score = 0;
		this.player1 = "P1";
		this.player2 = "P2";
	}

	getBallPositions() {
		return this.ball.getPosition();
	}

	update() {
		this.ball.updatePosition(this.paddleLeft, this.paddleRight);
		const goalInfo = this.ball.goalDetection();

		if (goalInfo)
			this.#addScore(goalInfo);

		this.paddleLeft.update();
		this.paddleRight.update();
	}

	reset() {
		this.player1Score = 0;
		this.player2Score = 0;
		this.ball.resetPosition();
		this.paddleLeft.resetPosition();
		this.paddleRight.resetPosition();
	}

	getPaddleLeft() {
		return this.paddleLeft.getPosition();
	}

	getPaddleRight() {
		return this.paddleRight.getPosition();
	}

	updatePaddle(key, status, userId) {
		if (userId === this.player1)
			this.paddleLeft.setState(key, status);
		else if (userId === this.player2)
			this.paddleRight.setState(key, status);
	}

	getScoreValues() {
		return {
			player1Score: this.player1Score,
			player2Score: this.player2Score,
		};
	}

	isEndGame() {
		if (this.player1Score == WINNING_SCORE_PONTUATION || this.player2Score == WINNING_SCORE_PONTUATION) {
			this.ball.resetPosition();
			this.paddleLeft.resetPosition();
			this.paddleRight.resetPosition();
			return true;
		}
		return false;
	}

	#addScore(info) {
		if (info.player1)
			this.player1Score += 1;
		else if (info.player2)
			this.player2Score += 1;
	}
}
