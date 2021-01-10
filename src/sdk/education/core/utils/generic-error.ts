export class GenericErrorWrapper extends Error {

  stack?: string

  constructor(err: any) {
    super()
    if (err.hasOwnProperty('stack')) {
      this.stack = err.stack
    }
    if (err.hasOwnProperty('message')) {
      this.message = err.message
    }
    if (err.hasOwnProperty('name')) {
      this.name = err.name
    }
  }
}