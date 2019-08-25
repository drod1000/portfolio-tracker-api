
exports.up = function(knex) {
  return knex.schema.createTable('Stock', function(table) {
    table.increments('StockId');
    table.string('StockSymbol', 16);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Stock');
};
