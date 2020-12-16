import { Controller } from "stimulus"

const zipCodeBaseKey = 'a4076b30-1add-11eb-981e-7536aab3fc66'
const stripePubKey = 'pk_test_TWkpziVy3VU7GAi5Ph5TSzdr'

const deliverableZips = ['54229', '54301', '54302', '54303', '54304', '54305', '54306', '54307', '54308', '54311', '54313', '54324', '54344', '54115']

export default class extends Controller {
  static get targets() {
    return ['postal', 'postaled', 'postalError', 'intakePostal', 'shipping', 'continue']
  }

  connect() {
    const postal = this.postalTarget
    const postaled = this.postaled
    const basket = this.basket

    if (!basket || !basket.items) {
      window.location.href = "/basket"
      return false
    }

    if (basket.postalCode) {
      postal.textContent = basket.postalCode;
      postaled.value = basket.postalCode;
      this.toggleShippings(basket.postalCode)
    } else {
      fetch('https://jsonip.com')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          fetch(`https://geocoder.ca/?locate=${data.ip}&json=1`)
            .then((response) => {
              return response.json();
            })
            .then((location) => {
              postal.textContent = location.postal;
              postaled.value = location.postal;
              basket.postalCode = location.postal;
              window.localStorage.setItem('lunaBasket', JSON.stringify(basket))
              this.toggleShippings(basket.postalCode)
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  toggleShippings(zip) {
    const basket = this.basket
    const local = document.querySelector('[data-ship="local"]')
    const standard = document.querySelector('[data-ship="standard"')
    if (deliverableZips.includes(zip)) {
      local.classList.add('show')
      if (!basket.selectedShipping) {
        this.saveShipping('local')
        local.classList.add('selected')
      } else {
        document.querySelector(`[data-ship="${basket.selectedShipping}"]`).classList.add('selected')
        this.continueTarget.disabled = false
      }
    } else {
      local.classList.remove('show')
      if (basket.selectedShipping == 'local' || !basket.selectedShipping) {
        this.saveShipping('standard')
        standard.classList.add('selected')
      } else {
        document.querySelector(`[data-ship="${basket.selectedShipping}"]`).classList.add('selected')
        this.continueTarget.disabled = false
      }
    }
  }

  selectShipping(event) {
    const trigger = event.target.closest('.delivery')
    if (!trigger.classList.contains('selected')) {
      document.querySelector('.delivery.selected').classList.remove('selected')
      trigger.classList.add('selected')
      this.saveShipping(trigger.dataset.ship)
    }
  }

  saveShipping(name) {
    const basket = this.basket
    basket.selectedShipping = name
    this.continueTarget.disabled = false
    window.localStorage.setItem('lunaBasket', JSON.stringify(basket))
  }

  showPostaled() {
    this.intakePostal.classList.add('show')
    this.intakePostal.querySelector('input').select()
  }

  cancelPostal(event) {
    event.preventDefault()
    this.intakePostal.classList.remove('show')
  }

  validatePostal(event) {
    const trigger = event.target.closest('button')
    trigger.classList.add('spinner')
    const postalError = this.postalError
    const postaled = this.postaled
    const postal = this.postalTarget
    const intake = this.intakePostal
    const basket = this.basket
    const toggleShippings = this.toggleShippings
    fetch(`https://app.zipcodebase.com/api/v1/search?apikey=${zipCodeBaseKey}&country=US&codes=${postaled.value}`)
      .then((response) => {
        return response.json()
      })
      .then((info) => {
        if (info.results.hasOwnProperty('length')) {
          postalError.textContent = 'Please enter a valid zip code.'
          return
        }
        if (info.results[postaled.value]) {
          postal.textContent = postaled.value
          intake.classList.remove('show')
          postalError.textContent = ''
          basket.postalCode = postaled.value
          window.localStorage.setItem('lunaBasket', JSON.stringify(basket))
          this.toggleShippings(basket.postalCode)
          setTimeout(() => {
            trigger.classList.remove('spinner')
          }, 500);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  continue(event) {
    console.log(event.target);
    this.continueTarget.classList.add('spinner')

    // Create an instance of the Stripe object with your publishable API key
    var stripe = Stripe(stripePubKey);
    fetch('/.netlify/functions/checkout/start', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: window.localStorage.getItem('lunaBasket')
    })
      .then((response) => {
        return response.json();
      })
      .then((session) => {
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then((result) => {
        // If `redirectToCheckout` fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using `error.message`.
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  get shippings() {
    return this.shippingTargets
  }

  get basket() {
    const rawBasket = window.localStorage.getItem('lunaBasket') || '{}'
    return JSON.parse(rawBasket)
  }

  get intakePostal() {
    return this.intakePostalTarget
  }

  get postalError() {
    return this.postalErrorTarget
  }

  get postaled() {
    return this.postaledTarget
  }
}

// https://geocoder.ca/?locate=174.103.202.110&geoit=XML&json=1

// https://app.zipcodebase.com/api/v1/search?apikey=a4076b30-1add-11eb-981e-7536aab3fc66&codes=10005%2C51503
