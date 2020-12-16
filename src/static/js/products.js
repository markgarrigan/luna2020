import { Application } from "stimulus"

import ProductController from "../../products/product_controller.js"

const application = Application.start()
application.register("product", ProductController)