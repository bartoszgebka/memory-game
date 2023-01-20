import questionMark from "../img/question_mark.svg";

export class Card {
  #flipped = false;
  #matched = false;
  #name;
  #imageUrl;
  #element;

  constructor(image) {
    this.#name = image.name;
    this.#imageUrl = image.url;
    this.#element = this.#createElement();
  }

  #createElement() {
    const card = this.#createDiv("card");
    const cardInner = this.#createDiv("card__inner");
    const cardFront = this.#createDiv("card__front");
    const cardImg = this.#createImg(this.#imageUrl);
    const cardBack = this.#createDiv("card__back");
    const questionMarkImg = this.#createImg(questionMark);

    cardFront.append(cardImg);
    cardBack.append(questionMarkImg);
    cardInner.append(cardFront);
    cardInner.append(cardBack);
    card.append(cardInner);

    return card;
  }

  #createDiv(className) {
    const div = document.createElement("div");
    div.classList.add(className);
    return div;
  }

  #createImg(url) {
    const img = new Image();
    img.src = url;
    return img;
  }

  getElement() {
    return this.#element;
  }

  getName() {
    return this.#name;
  }

  flip() {
    this.#flipped = true;
    this.#element.classList.add("flip");
  }

  unflip() {
    this.#flipped = false;
    this.#element.classList.remove("flip");
  }

  match() {
    this.#matched = true;
    this.#element.classList.add("matched");
  }

  unmatch() {
    this.#matched = false;
    this.#element.classList.remove("matched");
  }

  isMatched() {
    return this.#matched;
  }

  isFlippedAndNotMatched() {
    return !this.#matched && this.#flipped;
  }

  isNotFlippedAndNotMatched() {
    return !this.#matched && !this.#flipped;
  }

  reset() {
    this.unflip();
    this.unmatch();
  }
}
