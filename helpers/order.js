export default (a, b) => {
  return a.data ? a.data.order - b.data.order : a.order - b.order
}