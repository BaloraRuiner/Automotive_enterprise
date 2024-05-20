
exports.up = async(knex) => {
  await knex.schema.createTable('cars', (table) => {
    table.increments().primary();
    table.string('brand').notNullable();
    table.boolean('status').notNullable();
    table.timestamp('dateOfRealise', {useTz: false}).notNullable();
    table.string('innerColor').notNullable();
    table.string('externalColor').notNullable();
    table.boolean('transmission').notNullable();
    table.timestamp('deletedAt', {useTz: false});
  });

  await knex.schema.createTable('carInstance', (table) => {
    table.increments().primary();
    table.integer('carInstanceId').notNullable();
    table.timestamp('deletedAt', {useTz: false});
    table.timestamp('buyAt', {useTz: false});

    table.foreign('carInstanceId').references('cars.id');
  });


  await knex.schema.createTable('details', (table) => {
    table.increments().primary();
    table.integer('carId').notNullable();
    table.string('machinePart').notNullable();
    table.string('name').notNullable();
    table.timestamp('deletedAt', {useTz: false});

    table.foreign('carId').references('cars.id');
  });


  await knex.schema.createTable('detailsInstance', (table) => {
    table.increments().primary();
    table.integer('detailInstanceId').notNullable();
    table.timestamp('deletedAt', {useTz: false});
    table.timestamp('buyAt', {useTz: false});

    table.foreign('detailInstanceId').references('details.id');
  });


  await knex.schema.createTable('users', (table) => {
    table.increments().primary();
    table.string('login').notNullable();
    table.string('password').notNullable();
    table.timestamp('createdAt', {useTz: false});
  });


  await knex.schema.createTable('orders', (table) => {
    table.increments().primary();
    table.integer('userId').notNullable();
    table.integer('orderStuffId').notNullable();
    table.integer('orderType').notNullable();
    table.timestamp('createdAt', {useTz: false});
    table.timestamp('cancelAt', {useTz: false});
    table.timestamp('completedAt', {useTz: false});

    table.foreign('userId').references('users.id');
  })
};

exports.down = async(knex) => {
  await Promise.all([
    knex.schema.dropTable('detailsInstance'),
    knex.schema.dropTable('carInstance'),
    knex.schema.dropTable('details'),
    knex.schema.dropTable('orders'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('cars')
  ])
};
