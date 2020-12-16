import { Controller } from "stimulus"

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

const compareNumbers = (a, b) => a.order - b.order

const sum = (a, c) => a + c

export default class extends Controller {
  // static targets = ["sub", "shipping", "total", "checkout"]

  static get targets() {
    return ["sub", "shipping", "total", "checkout"]
  }

  connect() {
    this.subtotal(this.basket)
    PubSub.subscribe('basketUpdated', () => {
      this.subtotal(this.basket)
    });
  }

  subtotal(basket) {
    const itemSubs = Object.keys(basket.items).map(key => basket.items[key].price * basket.items[key].qty)
    const sub = itemSubs.length ? itemSubs.reduce(sum) : 0
    this.subTarget.textContent = formatter.format(sub / 100)
    this.shipping(sub)
    if (sub == 0) {
      this.checkout.classList.remove('show')
    } else {
      this.checkout.classList.add('show')
    }
  }

  shipping(sub) {
    let shipping = 700
    if (sub >= 10000) {
      this.shippingTarget.textContent = 'FREE'
      shipping = 0
    } else {
      this.shippingTarget.textContent = formatter.format(shipping / 100)
    }
    this.total(sub + shipping)
  }

  total(total) {
    this.totalTarget.textContent = formatter.format(total / 100)
  }

  get checkout() {
    return this.checkoutTarget
  }

  get basket() {
    const rawBasket = window.localStorage.getItem('lunaBasket') || '{}'
    return JSON.parse(rawBasket)
  }
}