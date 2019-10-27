import * as Yup from 'yup';
import HelpOrder from '../schemas/HelpOrders';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class AnswerController {
  async store(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    const schema = Yup.object().shape({
      id: Yup.string(),
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid({ id, answer }))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const helpOrder = await HelpOrder.findOneAndUpdate(
      id,
      {
        answer,
        answer_at: new Date(),
      },
      { new: true }
    );

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help Order does not exist.' });
    }

    const student = await Student.findByPk(helpOrder.student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    Queue.add(AnswerMail.key, {
      answer,
      student,
    });

    return res.json(helpOrder);
  }
}

export default new AnswerController();
