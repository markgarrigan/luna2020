import { Application } from "stimulus"

import BasketController from "../../basket/basket_controller.js"

const application = Application.start()
application.register("basket", BasketController)