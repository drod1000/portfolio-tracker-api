
exports.up = function(knex) {
  return knex.schema.alterTable('StockPosition', function(table) {
    table.dropColumn('SellDate');
    table.dropColumn('SellPrice');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('StockPosition', function(table) {
    table.date('SellDate');
    table.decimal('SellPrice');
  });
};
