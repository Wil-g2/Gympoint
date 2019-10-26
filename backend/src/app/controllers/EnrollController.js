import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Enroll from '../models/Enroll';
import Plan from '../models/Plans';
import Student from '../models/Student';

class EnrollController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const enrolls = await Enroll.findAll({
      order: ['end_date'],
      attributes: [
        'id',
        'plan_id',
        'student_id',
        'start_date',
        'end_date',
        'price',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrolls);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const student = await Student.findByPk(req.body.student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does exist.' });
    }

    const plans = await Plan.findByPk(req.body.plan_id);

    if (!plans) {
      return res.status(400).json({ error: 'Plan does exist.' });
    }

    const { price, duration } = plans;

    const enroll = await Enroll.create({
      month_price: price,
      duration,
      ...req.body,
    });

    return res.json({ enroll });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const student = await Student.findByPk(req.body.student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does exist.' });
    }

    const plans = await Plan.findByPk(req.body.plan_id);

    if (!plans) {
      return res.status(400).json({ error: 'Plan does exist.' });
    }

    const { price, duration } = plans;

    const enroll = await Enroll.findByPk(req.params.id);
    await enroll.update(req.body);

    return res.json({ month_price: price, duration, ...req.body });
  }

  async delete(req, res) {
    const enroll = await Enroll.findByPk(req.params.id);

    if (!enroll) {
      return res.status(400).json({ error: 'Enroll dont exist in database.' });
    }

    await enroll.destroy();

    return res.json({ result: 'enroll delete with sucess.' });
  }
}

export default new EnrollController();
