import './env.js'
import faunadb from 'faunadb'
import order from '../helpers/order.js'

const DB = new faunadb.Client({
  secret: process.env.FAUNA_KEY
})

const {
  Ref,
  Paginate,
  Get,
  Match,
  Select,
  Index,
  Create,
  Collection,
  Join,
  Call,
  Lambda,
  Var,
  Map,
  Function: Fn,
} = faunadb.query;

const all = async (index) => {
  const { data } = await DB.query(Map(
    Paginate(
      Match(
        Index(index)
      )
    ),
    Lambda("X", Get(
      Var("X")
    ))
  ))
  return data.sort(order)
}

const add = async (collection, obj) => {
  const doc = await DB.query(Create(Collection(collection), obj))
}

export default {
  all,
  add,
  order
}