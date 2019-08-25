
exports.up = function(knex) {
  return knex.schema.table('StockHistory', table => {
    table.renameColumn('StockHistory', 'StockHistoryId')
  });
};

exports.down = function(knex) {
  return knex.schema.table('StockHistory', table => {
    table.renameColumn('StockHistoryId', 'StockHistory')
  });
};
