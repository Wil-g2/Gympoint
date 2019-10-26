import Sequelize, { Model } from 'sequelize';

class Enroll extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(10, 2),
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
    this.belongsTo(models.Plans, { foreignKey: 'plan_id' });
  }
}

export default Enroll;
