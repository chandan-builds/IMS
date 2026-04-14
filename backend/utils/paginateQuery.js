/**
 * Helper to paginate mongoose queries
 * @param {Object} query - Mongoose query object
 * @param {Object} reqQuery - Express request query containing page and limit
 * @returns {Promise<Object>} { data, pagination: { total, page, limit, pages } }
 */
async function paginateQuery(query, reqQuery) {
  const page = parseInt(reqQuery.page, 10) || 1;
  const limit = parseInt(reqQuery.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Clone the query object to get the total count
  const countQuery = query.model.find(query.getQuery());
  const total = await countQuery.countDocuments();

  const data = await query.skip(skip).limit(limit).exec();

  const pages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages
    }
  };
}

module.exports = {
  paginateQuery
};
