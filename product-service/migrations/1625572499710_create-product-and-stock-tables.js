/* eslint-disable camelcase */

exports.shorthands = undefined;


exports.up = pgm => {
    pgm.createTable('product', {
        id: {
            type: 'uuid',
            primaryKey: true
        },
        title: {
            type: 'text',
            notNull: true
        },
        description: {
            type: 'text',
        },
        price: {
            type: 'integer'
        }
    })
    pgm.createTable('stock', {
        product_id: {
            type: 'uuid'
        },
        count: {
            type: 'integer'
        }
    }, {
        constraints: {
            foreignKeys: {
                columns: 'product_id',
                references: 'product(id)'
            }
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('stock');
    pgm.dropTable('product');
};
