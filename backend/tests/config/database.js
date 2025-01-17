const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let mongoServer;

const connect = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

const close = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
};

const clear = async () => {
    if (mongoose.connection.readyState === 1) {
        const db = mongoose.connection.db;
        await db.dropDatabase();
    } else {
        console.error('Database connection not ready.');
    }
};

module.exports = {
    connect,
    close,
    clear,
};
