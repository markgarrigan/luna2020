import db from '../../helpers/db.js'

const getAsyncData = async () => {
  const products = await db.all("products")

  const response = products
    .filter(product => product.data.active)
    .map(product => product.data)
    .map(product => {
      product.images = product.images || {}
      product.options = product.options || []
      product.options = product.options.sort(db.order)
      product.options.map(option => ({
        ...option,
        values: option.values.sort(db.order)
      }))
      product.attributes = product.attributes || {}
      return product
    })

  process.send(response);
}

getAsyncData();