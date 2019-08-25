
export function up(knex) {
  return knex.schema.createTable('WatchlistStock', function(table) {
    table.increments('WatchlistStockId');
    table.integer('StockId').notNullable().unsigned();
    table.foreign('StockId').references('Stock.StockId');
    table.date('WatchDate').notNullable();
    table.decimal('WatchPrice').notNullable();
  })
}

export function down(knex) {
  return knex.schema.dropTable('WatchlistStock');
}