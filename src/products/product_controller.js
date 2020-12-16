import { Controller } from "stimulus"

export default class extends Controller {
  // static targets = ["id", "price", "name", "image", "tiny", "url", "options", "submit"]

  static get targets() {
    return ["slug", "price", "name", "image", "tiny", "url", "options", "submit"]
  }

  uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  hashCode(s) {
    var h = 0, l = s.length, i = 0;
    if (l > 0)
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
  };

  add(event) {
    event.preventDefault()

    const basketName = 'lunaBasket'

    this.submit.disabled = true

    const options = this.options.map(option => ({
      name: option.dataset.name,
      value: option.value
    }))

    const item = {
      slug: this.slug,
      name: this.name,
      description: options.length ? options.map(option => option.value).join(' | ') : null,
      image: this.image,
      tiny: this.tiny,
      price: this.price,
      url: this.url,
      qty: 1,
      options,
    }

    // create a hash of the item
    const hash = this.hashCode(JSON.stringify(item))

    // Get the current basket
    const rawBasket = window.localStorage.getItem('lunaBasket') || '{}'
    const basket = JSON.parse(rawBasket)

    // Add an id to new baskets
    basket.id = basket.id || this.uuidv4()

    // Get or create a new items object
    basket.items = basket.items ? basket.items : {}

    // Add the item to the basket's items
    if (basket.items[hash]) {
      basket.items[hash].qty = basket.items[hash].qty + 1
    } else {
      basket.items[hash] = item
      basket.items[hash].order = Date.now()
    }

    window.localStorage.setItem('lunaBasket', JSON.stringify(basket))
    window.location.href = '/basket'
  }

  get slug() {
    return this.slugTarget.value
  }

  get price() {
    return this.priceTarget.value
  }

  get name() {
    return this.nameTarget.value
  }

  get image() {
    return this.imageTarget.value
  }

  get tiny() {
    return this.tinyTarget.value
  }

  get url() {
    return this.urlTarget.value
  }

  get options() {
    return this.optionsTargets
  }

  get submit() {
    return this.submitTarget
  }
}