import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Plans from '../app/models/Plans';
import Enroll from '../app/models/Enroll';

import databaseConfig from '../config/database';

const models = [User, Student, Plans, Enroll];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
