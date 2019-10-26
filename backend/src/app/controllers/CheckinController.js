import * as Yup from 'yup';
import { subDays } from 'date-fns';
import Student from '../models/Student';
import Checkin from '../schemas/Checkin';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const limit = 3;
    const skip = limit * (page - 1);

    const checkin = await Checkin.find({
      student_id: id,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return res.json(checkin);
  }

  async store(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      student_id: Yup.number(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does exist.' });
    }

    const date = new Date();

    const checkinCount = await Checkin.find({
      student_id: id,
      createdAt: {
        $lt: date,
        $gte: subDays(date, 7),
      },
    });

    if (checkinCount.length >= 5) {
      return res
        .status(401)
        .json({ error: 'user can only do 5 checkins within 7 days.' });
    }

    const checkin = await Checkin.create({
      student_id: id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
