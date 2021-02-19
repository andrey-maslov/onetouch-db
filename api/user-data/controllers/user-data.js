const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  /**
   * List all the categories beloinging to the requesting user
   *
   * @param {*} ctx the request context
   */

  // async find(ctx) {
  //   let entities;
  //
  //   if (ctx.query.scope && ctx.query.scope === 'all') {
  //     entities = await strapi.services['user-data'].find();
  //   } else if (ctx.query._q) {
  //     entities = await strapi.services['user-data'].search({
  //       ...ctx.query,
  //       'user.id': ctx.state.user.id
  //     });
  //   } else {
  //     entities = await strapi.services['user-data'].find({
  //       ...ctx.query,
  //       'user.id': ctx.state.user.id
  //     });
  //   }
  //
  //   return entities.map(entity => sanitizeEntity(entity, { model: strapi.models['user-data'] }));
  // },


  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    ctx.request.body.user = ctx.state.user.id;
    if (ctx.state.user.userData) {
      return ctx.badRequest(null, 'User already has userData instance. Use UPDATE request instead CREATE');
    }
    let entity = await strapi.services['user-data'].create(ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models['user-data'] });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [test] = await strapi.services['user-data'].find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });

    if (!test) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['user-data'].update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services['user-data'].update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models['user-data'] });
  },


  /**
   * Get the category with a specific ID
   *
   * @param {*} ctx the request context
   */
  // async findOne(ctx) {
  //   const { id } = ctx.params;
  //
  //   const entity = await strapi.services['user-data'].findOne({ id, 'user.id': ctx.state.user.id });
  //
  //   if (!entity) {
  //     return ctx.unauthorized(`You can't view this entry`);
  //   }
  //
  //   return sanitizeEntity(entity, { model: strapi.models['user-data'] });
  // },


  /**
   * Delete a record
   *
   * @param {*} ctx the request context
   */
  async delete(ctx) {
    const [test] = await strapi.services['user-data'].find({
      id: ctx.params.id,
      "user.id": ctx.state.user.id,
    });

    if (!test) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    let entity = await strapi.services['user-data'].delete({ id: ctx.params.id });
    return sanitizeEntity(entity, { model: strapi.models['user-data'] });
  }
};
