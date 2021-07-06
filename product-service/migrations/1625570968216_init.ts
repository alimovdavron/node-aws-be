/* eslint-disable camelcase */
import { MigrationBuilder } from "node-pg-migrate"
exports.shorthands = undefined;

exports.up = (pgm: MigrationBuilder) => {
    pgm.createExtension("uuid-ossp", {
        ifNotExists: true
    });
};

exports.down = (pgm: MigrationBuilder) => {
    pgm.dropExtension("uuid-ossp");
};
