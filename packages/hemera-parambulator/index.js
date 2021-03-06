'use strict'

const Hp = require('hemera-plugin')
const Parambulator = require('parambulator')

exports.plugin = Hp(function hemeraParambulator () {
  const hemera = this
  const PreValidationError = hemera.createError('PreValidationError')

  hemera.ext('onServerPreHandler', function (ctx, req, res, next) {
    let plugin = ctx._actMeta.plugin
    let schema = ctx._actMeta.schema
    let pattern = req.payload.pattern
    let currentPayloadValidator = plugin.options.payloadValidator

    if (currentPayloadValidator !== exports.attributes.name) {
      return next()
    }

    let pbSchema = schema.pb$ || schema

    let paramcheck = Parambulator(pbSchema)
    paramcheck.validate(pattern, (err) => {
      if (err) {
        return res.send(new PreValidationError({ message: err.message, details: err.parambulator }))
      }
      res.send()
    })
  })
}, '>=1.5.0')

exports.options = {}

exports.attributes = {
  pkg: require('./package.json')
}
