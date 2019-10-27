import * as Yup from 'yup';
import HelpOrder from '../schemas/HelpOrders';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const limit = 10;
    const skip = limit * (page - 1);

    const helpOrder = await HelpOrder.find({
      answer_at: null,
    })
      .skip(skip)
      .limit(limit);

    return res.json(helpOrder);
  }

  async store(req, res) {
    const { id } = req.params;
    const { question } = req.body;

    const schema = Yup.object().shape({
      student_id: Yup.number(),
      question: Yup.string().required(),
    });

    if (!(await schema.isValid({ student_id: id, question }))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does exist.' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json(helpOrder);
  }

  async show(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const limit = 10;
    const skip = limit * (page - 1);

    const helpOrder = await HelpOrder.find({
      student_id: id,
    })
      .skip(skip)
      .limit(limit);

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
