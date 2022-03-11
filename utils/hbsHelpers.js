module.exports = {
  ifeq(a, b, options) {
    if (a == b) {
      return options.fn(this)
    }

    return options.inverse(this)
  },

  ifnot(a, options) {
    if (a) {
      return options.fn(this)
    }

    return options.inverse(this)
  }
}