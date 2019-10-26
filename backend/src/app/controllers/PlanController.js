import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlanController {
  async index(req, res) {
    const plans = await Plans.findAll();

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const plan = await Plans.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const plan = await Plans.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan dont exist in database.' });
    }

    const { id, title, duration, price } = await plan.update(req.body);
    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plans.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan dont exist in database.' });
    }

    await plan.destroy();

    return res.json({ result: 'Plans delete with sucess.' });
  }
}

export default new PlanController();
