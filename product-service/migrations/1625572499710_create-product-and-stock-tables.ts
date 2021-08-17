/* eslint-disable camelcase */
import { MigrationBuilder } from "node-pg-migrate"
exports.shorthands = undefined;

exports.up = (pgm: MigrationBuilder) => {
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
        },
        img_url: {
            type: 'text'
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

exports.down = (pgm: MigrationBuilder) => {
    pgm.dropTable('stock');
    pgm.dropTable('product');
};
