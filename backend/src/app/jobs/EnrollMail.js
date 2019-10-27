import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollMail {
  get key() {
    return 'EnrollMail';
  }

  async handle({ data }) {
    const { student, plans, enroll } = data;
    await Mail.sendMail({
      to: `${student.name} <${student.email}`,
      subject: 'Matricula Gym Point',
      template: 'enroll',
      context: {
        student: student.name,
        plan: plans.title,
        endOfDate: format(
          parseISO(enroll.end_date),
          " 'dia' dd 'de' MMMM', às' H:mm'h' ",
          {
            locale: pt,
          }
        ),
        price: enroll.price,
      },
    });
  }
}

export default new EnrollMail();
