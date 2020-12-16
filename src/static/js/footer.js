import { Application } from "stimulus"

import FooterController from "../../footer_controller.js"

const application = Application.start()
application.register("footer", FooterController)