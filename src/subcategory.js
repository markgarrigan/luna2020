import db from '../helpers/db.js'

const getAsyncData = async () => {
  const categories = await db.all("categories")
  const products = await db.all("products")

  // Add the parent, gelo_path, and products to the category
  const response = categories
    .filter(category => category.data.active && category.data.parent)
    .map(category => ({
      ...category.data,
      gelo_path: category.data.parent,
      parent: categories.find(parent => parent.data.slug == category.data.parent).data,
      products: products.filter(product => {
        const { active, categories } = product.data
        return active && categories && categories[category.data.slug]
      }).map(product => product.data)
    }
    ))

  process.send(response);
}

getAsyncData();

















// // Fetch the service account key JSON file contents
// const admin = require("firebase-admin")
// const serviceAccount = require(`${process.cwd()}/luna-2020-firebase-admin.json`)

// if (admin.apps.length) {
//   admin.app()
// } else {
//   // Initialize the app with a service account, granting admin privileges
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://luna-2020.firebaseio.com'
//   })
// }

// // As an admin, the app has access to read and write all data, regardless of Security Rules
// const db = admin.database()
// const parent = db.ref('dev')
// const categoriesRef = parent.child('categories')
// const productsRef = parent.child('products')

// const getAsyncData = async () => {
//   const categoriesSnap = await categoriesRef.once('value')
//   const categories = categoriesSnap.val()
//   const productsSnap = await productsRef.once('value')
//   let products = productsSnap.val()

//   // Create an array of categories
//   let response = Object.keys(categories).map(key => ({
//     id: key,
//     ...categories[key]
//   }))

//   // Create an array of products
//   products = Object.keys(products).map(key => ({
//     id: key,
//     ...products[key]
//   }))

//   // Add subcategories to category as children array
//   const parents = response
//     .filter(category => category.active && !category.parent)
//     .map(category => {
//       category.children = response.filter(child => child.parent == category.id).map(child => ({
//         id: child.id,
//         slug: child.slug,
//         name: child.name
//       }))
//       return category
//     })

//   // Add the parent, gelo_path, and products to the category
//   response = response
//     .filter(category => category.active && category.parent)
//     .map(category => {
//       category.parent = parents.find(parent => parent.id == category.parent)
//       category.gelo_path = category.parent.slug
//       category.products = products.filter(product => product.active && product.categories && product.categories[category.id])
//       return category
//     })

//   process.send(response);
// }

// getAsyncData();