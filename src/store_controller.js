import { Controller } from "stimulus"

const compareNumbers = (a, b) => a.order - b.order

export default class extends Controller {
  // static targets = ["count", "carticon", "whencount", "empty", "items", "checkout"]

  static get targets() {
    return ["count", "carticon", "whencount", "empty", "items", "checkout"]
  }

  connect() {
    this.showBasketCount()
    this.buildBasketItems(this.basket)
    PubSub.subscribe('basketUpdated', () => {
      this.showBasketCount()
      this.buildBasketItems(this.basket)
    });
  }

  sumQty(items) {
    return Object.keys(items)
      .map(key => items[key].qty)
      .reduce((a, c) => a + c)
  }

  countItems(items) {
    return items ? Object.keys(items).length : false
  }

  showBasketCount() {
    if (this.basketCount && this.countTargets.length) {
      this.whencountTarget.classList.add('show')
      for (let i = 0; i < this.countTargets.length; i++) {
        this.countTargets[i].textContent = this.sumQty(this.basket.items);
        this.countTargets[i].classList.add('show');
      }
      const moreItems = document.querySelector('.cart [data-more-items]')
      if (this.basketCount > 3) {
        let sentence = moreItems.dataset.moreItems
        const qtyMoreItems = this.basketCount - 3
        sentence = sentence.replace(/X/, qtyMoreItems)
        sentence = sentence.replace(/S/, qtyMoreItems == 1 ? '' : 's')
        const target = moreItems.querySelector('span')
        target.textContent = sentence
        moreItems.classList.add('show')
      } else {
        moreItems.classList.remove('show')
      }
    } else {
      this.whencountTarget.classList.remove('show')
      for (let i = 0; i < this.countTargets.length; i++) {
        this.countTargets[i].classList.remove('show');
      }
    }
  }

  buildBasketItems(basket) {
    const itemEls = this.items.querySelectorAll('.item');
    [...itemEls].forEach((item) => {
      item.remove()
    })
    if (basket) {
      if (basket.items) {
        // Create an array of products
        const items = Object.keys(basket.items).map(key => ({
          key: key,
          ...basket.items[key]
        })).sort(compareNumbers).reverse()
        if (items.length) {
          [...this.checkoutTargets].forEach((checkout) => {
            checkout.classList.add('show')
          })
          for (let i = 2; i >= 0; i--) {
            const item = items[i];
            if (item) {
              const itemEl = document.createElement('li')
              const itemLinkEl = document.createElement('a')
              const imgqtyEl = document.createElement('span')
              const imgEl = document.createElement('img')
              const qtyEl = document.createElement('i')
              const infoEl = document.createElement('span')
              const nameEl = document.createElement('strong')
              const optsEl = document.createElement('i')

              itemEl.id = 'storeItem' + item.key
              itemEl.classList.add('item')
              itemLinkEl.href = item.url
              imgEl.src = item.tiny
              qtyEl.textContent = item.qty
              imgqtyEl.appendChild(imgEl)
              imgqtyEl.appendChild(qtyEl)
              itemLinkEl.appendChild(imgqtyEl)
              nameEl.textContent = item.name
              infoEl.appendChild(nameEl)
              if (item.options.length) {
                optsEl.textContent = item.options.map(option => option.value).join(' | ')
                infoEl.appendChild(optsEl)
              }
              itemLinkEl.appendChild(infoEl)
              itemEl.appendChild(itemLinkEl)
              this.items.prepend(itemEl)
            }
          }
        } else {
          this.empty.classList.add('show');
          [...this.checkoutTargets].forEach((checkout) => {
            checkout.classList.remove('show')
          })
        }
      } else {
        this.empty.classList.add('show');
        [...this.checkoutTargets].forEach((checkout) => {
          checkout.classList.remove('show')
        })
      }
    } else {
      this.empty.classList.add('show');
      [...this.checkoutTargets].forEach((checkout) => {
        checkout.classList.remove('show')
      })
    }
  }

  // flipbody(event) {
  //   if (this.element.dataset.sti) {
  //     clearTimeout(this.element.dataset.sti)
  //   }
  //   if (!this.element.dataset.allow) {
  //     this.element.dataset.allow = event.target.id
  //     this.element.dataset.sti = setTimeout(() => {
  //       this.element.classList.add('overflow')
  //     }, 700);
  //     return true
  //   }
  //   if (this.element.dataset.allow == event.target.id) {
  //     this.element.classList.remove('overflow')
  //     delete this.element.dataset.allow
  //   } else {
  //     this.element.dataset.allow = event.target.id
  //   }
  // }

  hideid(event) {
    document.getElementById(event.target.dataset.hide).checked = false
    this.carticonTarget.classList.toggle('hide')
  }

  hideme(event) {
    const cart = document.getElementById('cart')
    if (cart) {
      cart.checked = false
    }
    const sandwich = document.getElementById('sandwich')
    if (sandwich) {
      sandwich.checked = false
    }
    const sub = document.getElementById('sub-dropdown')
    if (sub) {
      sub.checked = false
    }
  }

  get items() {
    return this.itemsTarget
  }

  get empty() {
    return this.emptyTarget
  }

  get checkout() {
    return this.checkoutTarget
  }

  get basketCount() {
    return this.countItems(this.basket.items)
  }

  get basket() {
    const rawBasket = window.localStorage.getItem('lunaBasket') || '{}'
    return JSON.parse(rawBasket)
  }
}