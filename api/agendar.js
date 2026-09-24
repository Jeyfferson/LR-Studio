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
    // 1. Trata a string da chave privada
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';

    // Remove aspas nas pontas se existirem
    privateKey = privateKey.trim().replace(/^["']|["']$/g, '');

    // Converte os \n literais em quebras de linha reais exigidas pelo OpenSSL
    privateKey = privateKey.replace(/\\n/g, '\n');

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
    const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();

    // 2. Autenticação na API do Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // 3. Monta horário com fuso horário do Brasil (America/Sao_Paulo)
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
      description: `Agendamento efetuado via site para ${nome}.`,
      start: {
        dateTime: startISO,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: endISO,
        timeZone: 'America/Sao_Paulo',
      },
    };

    // 4. Insere o evento no Google Calendar
    const response = await calendar.events.insert({
      calendarId: calendarId,
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