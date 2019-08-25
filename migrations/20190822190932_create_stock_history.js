
export function up(knex) {
  return knex.schema.createTable('StockHistory', function(table) {
    table.increments('StockHistory');
    table.integer('StockId').notNullable().unsigned();
    table.foreign('StockId').references('Stock.StockId');
    table.date('RecordDate').notNullable();
    table.decimal('OpenPrice').notNullable();
    table.decimal('ClosePrice').notNullable();
  })
}

export function down(knex) {
  return knex.schema.dropTable('StockHistory');
}
