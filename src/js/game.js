import { Card } from "./card";
import { shuffle } from "lodash";

export class Game {
  // DOM elements
  #gridEL = document.querySelector(".grid");
  #btnStartEl = document.querySelector(".btn-start");
  #movesEl = document.querySelector(".stats__moves");
  #timerEl = document.querySelector(".stats__timer");

  #isStarted = false;
  #isFirstGame = true;
  #totalMoves = 0;
  #totalTime = 0;
  #interval;
  #cards;

  constructor(images) {
    this.#initCards(images);
    this.#attachEventListeners();
  }

  #initCards(images) {
    this.#createCards(images);
    this.#shuffleAndRenderCards();
  }

  #createCards(images) {
    this.#cards = [];
    for (const [name, url] of Object.entries(images)) {
      this.#cards = [
        new Card({ name, url }),
        new Card({ name, url }),
        ...this.#cards,
      ];
    }
  }

  #shuffleAndRenderCards() {
    this.#shuffle();
    this.#render();
  }

  #shuffle() {
    this.#cards = shuffle(this.#cards);
  }

  #render() {
    this.#gridEL.innerHTML = null;

    this.#cards
      .map((c) => c.getElement())
      .forEach((el) => {
        this.#gridEL.append(el);
      });
  }

  #attachEventListeners() {
    this.#gridEL.addEventListener("click", (e) => {
      const cardEl = e.target.closest(".card");
      if (cardEl) {
        const card = this.#getCard(cardEl);
        this.#flipCard(card);
      }
    });

    this.#btnStartEl.addEventListener("click", this.#startClick.bind(this));
  }

  #flipCard(card) {
    if (!this.#isStarted) {
      if (this.#isFirstGame) {
        this.#startGame();
      } else {
        this.#playAgain();
        return;
      }
    }

    if (card.isNotFlippedAndNotMatched()) {
      const flippedAndNotMatchedCards = this.#cards.filter((c) =>
        c.isFlippedAndNotMatched()
      );

      if (flippedAndNotMatchedCards.length < 2) {
        this.#totalMoves++;
        card.flip();
        flippedAndNotMatchedCards.push(card);
      }

      if (flippedAndNotMatchedCards.length === 2) {
        if (
          flippedAndNotMatchedCards.every((c) => c.getName() === card.getName())
        ) {
          this.#matchCards(flippedAndNotMatchedCards);
        } else {
          setTimeout(() => {
            this.#unflipCards(flippedAndNotMatchedCards);
          }, 700);
        }
      }

      if (this.#cards.every((c) => c.isMatched())) {
        this.#endGame();
      }
    }
  }

  #getCard(cardEl) {
    return this.#cards.find((c) => c.getElement() === cardEl);
  }

  #matchCards(flippedCards) {
    flippedCards.forEach((c) => c.match());
  }

  #unflipCards(flippedCards) {
    flippedCards.forEach((c) => c.unflip());
  }

  #startClick() {
    if (this.#isFirstGame) {
      this.#startGame();
    } else {
      this.#playAgain();
    }
  }

  #startGame() {
    this.#btnStartEl.setAttribute("disabled", "");
    this.#isStarted = true;
    this.#isFirstGame = false;
    this.#setInterval();
  }

  #playAgain() {
    this.#btnStartEl.setAttribute("disabled", "");
    this.#resetStats();
    this.#resetCards();
    this.#shuffleAndRenderCards();
    this.#setInterval();
  }

  #resetStats() {
    this.#totalMoves = 0;
    this.#totalTime = 0;
    this.#isStarted = true;
  }

  #resetCards() {
    this.#cards.forEach((c) => c.reset());
  }

  #setInterval() {
    this.#interval = setInterval(() => {
      this.#totalTime++;
      this.#movesEl.innerText = `Ruchy: ${this.#totalMoves}`;
      this.#timerEl.innerText = `Czas: ${this.#totalTime} sekund`;
    }, 1000);
  }

  #endGame() {
    clearInterval(this.#interval);
    this.#isStarted = false;
    this.#btnStartEl.removeAttribute("disabled");
  }
}
