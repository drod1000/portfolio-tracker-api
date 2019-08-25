
export function up(knex) {
  return knex.schema.createTable('Stock', function(table) {
    table.increments('StockId');
    table.string('StockSymbol', 16);
  })
}

export function down(knex) {
  return knex.schema.dropTable('Stock');
}
