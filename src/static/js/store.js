import { Application } from "stimulus"

import StoreController from "../../store_controller.js"

const application = Application.start()
application.register("store", StoreController)