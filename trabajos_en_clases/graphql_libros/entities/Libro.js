const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Libro",
  tableName: "libros",
  columns: {
    _id: {
      primary: true,
      type: "mongodb-object-id",
      objectId: true
    },
    titulo: {
      type: "varchar",
      nullable: false
    },
    autor: {
      type: "varchar",
      nullable: false
    },
    editorial: {
      type: "varchar",
      nullable: false
    },
    anio: {
      type: "int",
      nullable: false
    },
    descripcion: {
      type: "text",
      nullable: false
    },
    numero_pagina: {
      type: "int",
      nullable: false
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true
    }
  }
});
