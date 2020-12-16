import { Controller } from "stimulus"

export default class extends Controller {
  // static targets = ["count", "carticon", "whencount", "empty", "items", "checkout"]

  static get targets() {
    return ["year"]
  }

  connect() {
    this.yearTarget.textContent = new Date().getFullYear()
  }

}