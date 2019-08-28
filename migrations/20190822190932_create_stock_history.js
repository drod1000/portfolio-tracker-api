
exports.up = function(knex) {
  return knex.schema.createTable('StockHistory', function(table) {
    table.increments('StockHistoryId');
    table.integer('StockId').notNullable().unsigned();
    table.foreign('StockId').references('Stock.StockId');
    table.date('RecordDate').notNullable();
    table.decimal('OpenPrice').notNullable();
    table.decimal('ClosePrice').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('StockHistory');
};
