import db from '../helpers/db.js'

const getAsyncData = async () => {
  const categories = await db.all("categories")
  const products = await db.all("products")

  const response = categories
    .filter(category => category.data.active && !category.data.parent)
    .map(category => ({
      ...category.data,
      children: categories.filter(child => child.data.parent == category.data.slug).map(child => ({
        slug: child.data.slug,
        name: child.data.name
      })),
      products: products.filter(product => {
        const { active, categories } = product.data
        return active && categories && categories[category.data.slug]
      }).map(product => product.data)
    }))

  process.send(response);
}

getAsyncData();