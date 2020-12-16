import { Application } from "stimulus"

import SuccessController from "../../success_controller.js"

const application = Application.start()
application.register("success", SuccessController)