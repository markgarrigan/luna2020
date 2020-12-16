import { Application } from "stimulus"

import TotalsController from "../../basket/totals_controller.js"

const application = Application.start()
application.register("totals", TotalsController)