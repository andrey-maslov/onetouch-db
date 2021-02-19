const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

'use strict';

module.exports = {

  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    ctx.request.body.user = ctx.state.user.id;
    let entity = await strapi.services.friend.create(ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models.friend });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [friend] = await strapi.services.friend.find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });

    if (!friend) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.friend.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.friend.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.friend });
  },



  /**
   * List all the categories beloinging to the requesting user
   *
   * @param {*} ctx the request context
   */
  async find(ctx) {
    let entities;
    console.log('db name', process.env.DB_NAME)
    if (ctx.query._q) {
      entities = await strapi.services.friend.search({
        ...ctx.query,
        'user.id': ctx.state.user.id
      });
    } else {
      entities = await strapi.services.friend.find({
        ...ctx.query,
        'user.id': ctx.state.user.id
      });
    }
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.friend }));
  },


  /**
   * Get the category with a specific ID
   *
   * @param {*} ctx the request context
   */
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.friend.findOne({ id, 'user.id': ctx.state.user.id });

    if (!entity) {
      return ctx.unauthorized(`You can't view this entry`);
    }
    return sanitizeEntity(entity, { model: strapi.models.friend });
  },


  /**
   * Delete a record
   *
   * @param {*} ctx the request context
   */
  async delete(ctx) {
    const [friend] = await strapi.services.friend.find({
      id: ctx.params.id,
      "user.id": ctx.state.user.id,
    });

    if (!friend) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    let entity = await strapi.services.friend.delete({ id: ctx.params.id });
    return sanitizeEntity(entity, { model: strapi.models.friend });
  },


};
