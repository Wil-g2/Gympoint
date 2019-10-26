import Sequelize, { Model } from 'sequelize';
import { addMonths, startOfDay } from 'date-fns';

class Enroll extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(10, 2),
        duration: Sequelize.VIRTUAL,
        month_price: Sequelize.VIRTUAL,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async enroll => {
      if (enroll.month_price && enroll.duration) {
        enroll.price = enroll.month_price * enroll.duration;

        enroll.end_date = addMonths(
          startOfDay(enroll.start_date),
          enroll.duration
        );
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
    this.belongsTo(models.Plans, { foreignKey: 'plan_id' });
  }
}

export default Enroll;
