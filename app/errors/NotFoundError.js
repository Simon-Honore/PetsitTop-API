/** Class representing a no resource found error. */
class NotFoundError extends Error {
  /**
   * create a no resource found error
   *
   * @augments Error
   */
  constructor() {
    super('No resource found');
    this.httpStatusCode = 404;
  }
}

module.exports = NotFoundError;
