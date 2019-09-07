
exports.up = function(knex) {
  return knex.schema.createTable('StockSale', function(table) {
    table.increments('StockSaleId');
    table.integer('StockId').notNullable().unsigned();
    table.foreign('StockId').references('Stock.StockId');
    table.integer('PositionId').notNullable().unsigned();
    table.foreign('PositionId').references('StockPosition.PositionId');
    table.decimal('Quantity').notNullable();
    table.date('SellDate').notNullable();
    table.decimal('SellPrice').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('StockSale');
};
