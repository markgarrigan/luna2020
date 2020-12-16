import { Controller } from "stimulus"

const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

export default class extends Controller {
  static get targets() {
    return ['main', 'email']
  }

  connect() {
    var session_id = getUrlParameter('session_id')
    if (session_id) {
      window.localStorage.removeItem('lunaBasket')
      fetch('/.netlify/functions/checkout-session', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id
        })
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.emailTarget.textContent = data.customer.email
          this.mainTarget.classList.add('show')
          console.log(data);
        })
        .then((result) => {
          // If `redirectToCheckout` fails due to a browser or network
          // error, you should display the localized error message to your
          // customer using `error.message`.
          // if (result.error) {
          //   alert(result.error.message);
          // }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      console.log('erase the basket');
    } else {
      window.location.href = "/"
    }
  }
}