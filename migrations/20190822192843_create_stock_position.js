
exports.up = function(knex) {
  return knex.schema.createTable('StockPosition', function(table) {
    table.increments('PositionId');
    table.integer('StockId').notNullable().unsigned();
    table.foreign('StockId').references('Stock.StockId');
    table.decimal('Quantity').notNullable();
    table.date('BuyDate').notNullable();
    table.decimal('BuyPrice').notNullable();
    table.date('SellDate');
    table.decimal('SellPrice');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('StockPosition');
};
