import { Controller } from "stimulus"

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

const compareNumbers = (a, b) => a.order - b.order

export default class extends Controller {
  // static targets = ["empty", "wait"]

  static get targets() {
    return ["empty", "wait"]
  }

  connect() {
    if (this.hasWaitTarget) {
      this.build(this.basket)
    }
  }

  add(event) {
    event.preventDefault()
  }

  remove(event) {
    event.preventDefault()
    const trigger = event.target.closest('a')
    trigger.classList.add('spinner')
    const basket = { ...this.basket }
    const id = trigger.dataset.id
    delete basket.items[id]
    setTimeout(() => {
      this.refresh(basket)
      document.getElementById('basketItem' + id).remove()
    }, 1200)
  }

  update(event) {
    const basket = { ...this.basket }
    const qty = Number(event.target.value)
    const id = event.target.dataset.id
    const price = basket.items[id].price
    basket.items[id].qty = qty
    document.getElementById('price' + id).textContent = formatter.format((price / 100) * qty)
    this.refresh(basket)
  }

  refresh(basket) {
    this.basket = basket
  }

  build(basket) {
    if (basket) {
      if (basket.items) {
        // Create an array of products
        const items = Object.keys(basket.items).map(key => ({
          key: key,
          ...basket.items[key]
        }))
        if (items.length) {
          items.sort(compareNumbers).reverse().forEach(item => {
            const itemEl = document.createElement('div')
            itemEl.id = 'basketItem' + item.key
            const nameEl = document.createElement('h3')
            const optsEl = document.createElement('span')
            const infoEl = document.createElement('h3')
            const imgEl = document.createElement('img')
            const priceEl = document.createElement('span')
            const qtyHolderEl = document.createElement('span')
            const qtyEl = document.createElement('select')
            const removeHolderEl = document.createElement('p')
            const removeEl = document.createElement('a')
            removeEl.href = "#"
            removeEl.dataset.action = "basket#remove"
            removeEl.dataset.id = item.key
            removeEl.innerHTML = '<span>remove</span>'
            removeHolderEl.appendChild(removeEl)
            qtyEl.dataset.id = item.key
            qtyEl.dataset.action = "basket#update"
            for (let index = 1; index < 100; index++) {
              const optionEl = document.createElement('option')
              optionEl.value = index
              optionEl.textContent = index
              if (index == item.qty) {
                optionEl.selected = true
              }
              qtyEl.appendChild(optionEl)
            }
            qtyHolderEl.appendChild(qtyEl)
            infoEl.appendChild(qtyHolderEl)
            infoEl.appendChild(priceEl)
            infoEl.dataset.info = ''
            imgEl.src = item.image
            nameEl.textContent = item.name
            nameEl.dataset.name = ''
            if (item.options.length) {
              optsEl.textContent = item.options.map(option => option.value).join(' | ')
              nameEl.appendChild(optsEl)
            }
            priceEl.textContent = formatter.format((item.price / 100) * item.qty)
            priceEl.id = 'price' + item.key
            itemEl.appendChild(imgEl)
            itemEl.appendChild(nameEl)
            itemEl.appendChild(infoEl)
            itemEl.appendChild(removeHolderEl)
            itemEl.classList.add('show')
            this.element.appendChild(itemEl)
          })
        } else {
          this.empty.classList.add('show')
        }
      } else {
        this.empty.classList.add('show')
      }
    } else {
      this.empty.classList.add('show')
    }
    this.wait.classList.remove('show')
  }

  get empty() {
    return this.emptyTarget
  }

  get wait() {
    return this.waitTarget
  }

  set basket(basket) {
    window.localStorage.setItem('lunaBasket', JSON.stringify(basket))
    PubSub.publish('basketUpdated', basket)
    if (!Object.keys(basket.items).length) {
      this.emptyTarget.classList.add('show')
    }
  }

  get basket() {
    const rawBasket = window.localStorage.getItem('lunaBasket') || '{}'
    return JSON.parse(rawBasket)
  }
}