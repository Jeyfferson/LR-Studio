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
    // Trata a chave privada para aceitar formatos com \\n e quebras reais
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
    const formattedKey = rawKey.replace(/\\n/g, '\n').replace(/"/g, '');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: formattedKey,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Calcula horário final (adiciona 1h30min ao horário inicial)
    const [hora, minuto] = horario.split(':').map(Number);
    let horaFim = hora + 1;
    let minutoFim = minuto + 30;

    if (minutoFim >= 60) {
      horaFim += 1;
      minutoFim -= 60;
    }

    const pad = (n) => String(n).padStart(2, '0');
    const startISO = `${data}T${pad(hora)}:${pad(minuto)}:00-03:00`;
    const endISO = `${data}T${pad(horaFim)}:${pad(minutoFim)}:00-03:00`;

    const event = {
      summary: `${procedimento} - ${nome}`,
      description: `Agendamento efetuado via site por ${nome}.`,
      start: {
        dateTime: startISO,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: endISO,
        timeZone: 'America/Sao_Paulo',
      },
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Agendamento adicionado ao Google Calendar!',
      eventId: response.data.id
    });
  } catch (error) {
    console.error('Erro no Google Calendar API:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Erro interno na API do Google Calendar' 
    });
  }
}