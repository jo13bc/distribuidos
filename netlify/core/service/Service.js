const { readData, writeData } = require('../utils/Util');

class Service {
    constructor(fileName) {
        this.ENTITY_NAME = fileName;
        this.fileName = fileName.toLowerCase();
        this.entities = readData(this.fileName);
    }

    insert(entity, id, callback = undefined) {
        if (this.entities.find(b => b.id === id)) {
            throw `${this.ENTITY_NAME} already exits`;
        }
        let ID = id ? id : (this.entities.length + 1);
        entity.id = ID;
        this.entities.push(entity);
        writeData(this.fileName, this.entities);
        if (callback) callback(entity);
        return { message: `${this.ENTITY_NAME} was added` };
    };

    update(entity, id, callback = undefined) {
        if (!this.entities.find(b => b.id === id)) {
            throw `${this.ENTITY_NAME} not exits`;
        }
        this.entities = this.entities.map(b => (b.id === id) ? entity : b);
        writeData(this.fileName, this.entities);
        if (callback) callback(entity);
        return { message: `${this.ENTITY_NAME} was updated` };
    };

    delete(id, callback = undefined) {
        let entity = this.find(id);
        this.entities = this.entities.filter(b => b.id !== id);
        writeData(this.fileName, this.entities);
        if (callback) callback(entity);
        return { message: `${this.ENTITY_NAME} was deleted` };
    };

    find(id) {
        let entity = this.entities.find(b => b.id === id);
        if (entity) {
            return entity;
        }
        throw `${this.ENTITY_NAME} not found`;
    };

    list() {
        return this.entities;
    };
}

module.exports = Service;