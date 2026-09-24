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
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
    privateKey = privateKey.trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL?.trim(),
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Usa o objeto Date para calcular a virada de dia/hora automaticamente
    const startDateTime = new Date(`${data}T${horario}:00-03:00`);
    const endDateTime = new Date(startDateTime.getTime() + 90 * 60000); // +90 min

    const event = {
      summary: `${procedimento} - ${nome}`,
      description: `Agendamento efetuado via site para ${nome}.`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID?.trim(),
      requestBody: event,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Agendado com sucesso no Google Calendar!',
      eventId: response.data.id 
    });

  } catch (error) {
    console.error('Erro na API do Google Calendar:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}