import { Application } from "stimulus"

import CheckoutController from "../../checkout/checkout_controller.js"

const application = Application.start()
application.register("checkout", CheckoutController)