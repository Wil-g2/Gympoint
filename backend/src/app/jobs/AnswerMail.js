import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerlMail';
  }

  async handle({ data }) {
    const { student, answer } = data;
    await Mail.sendMail({
      to: `${student.name} <${student.email}`,
      subject: 'Respota Gym Point',
      template: 'answer',
      context: {
        student: student.name,
        answer,
      },
    });
  }
}

export default new AnswerMail();
