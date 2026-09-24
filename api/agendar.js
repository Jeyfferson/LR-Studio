import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { nome, procedimento, data, horario } = req.body;

  if (!nome || !procedimento || !data || !horario) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Define a data de início e fim (duração de 1h30 min)
    const startDateTime = `${data}T${horario}:00`;
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + 90 * 60000);

    const event = {
      summary: `${procedimento} - ${nome}`,
      description: `Agendamento efetuado via site por ${nome}.`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
    };

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return res.status(200).json({ success: true, message: 'Agendamento adicionado ao Google Calendar!' });
  } catch (error) {
    console.error('Erro no Google Calendar API:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}