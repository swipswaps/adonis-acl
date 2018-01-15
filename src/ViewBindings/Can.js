'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

module.exports = function (BaseTag) {
  return class CanTag extends BaseTag {
    /**
     * The tag name
     *
     * @method tagName
     *
     * @return {String}
     */
    get tagName () {
      return 'can'
    }

    /**
     * Tag is not a block tag
     *
     * @method isBlock
     *
     * @return {Boolean}
     */
    get isBlock () {
      return true
    }

    /**
     * Compile method to create block
     *
     * @method compile
     *
     * @param  {Object} compiler
     * @param  {Object} lexer
     * @param  {Object} buffer
     * @param  {String} options.body
     * @param  {Array} options.childs
     * @param  {Number} options.lineno
     *
     * @return {void}
     */
    compile (compiler, lexer, buffer, { body, childs, lineno }) {
      const compiledStatement = this._compileStatement(lexer, body, lineno).toStatement()

      /**
       * Open tag
       */
      buffer.writeLine(`var user = this.context.accessChild(this.context.resolve('auth'), ['user'])`)
      buffer.writeLine(`if (user && user.can(${compiledStatement})) {`)
      buffer.indent()

      /**
       * Re-parse all childs via compiler.
       */
      childs.forEach((child) => compiler.parseLine(child))

      /**
       * Close the tag
       */
      buffer.dedent()
      buffer.writeLine('}')
    }

    /**
     * Nothing needs to be done at runtime
     *
     * @method run
     */
    run () {}
  }
}