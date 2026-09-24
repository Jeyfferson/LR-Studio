import React, { useState } from 'react';
import { Calendar, CheckCircle, Sparkles } from 'lucide-react';

const FOTO_STUDIO = '/img/logo.png'; 

export default function App() {
  const [formData, setFormData] = useState({
    nome: '',
    procedimento: '',
    data: '',
    horario: ''
  });

  const [sucesso, setSucesso] = useState(false);

  // NUMERO DO WHATSAPP DO STUDIO
  const TELEFONE_STUDIO = '5541999353946'; 

  // Lista de Serviços
  const SERVICOS = [
    {
      id: 'corte',
      nome: 'Corte & Escova',
      preco: 'R$ 120',
      descricao: 'Lavagem especial, corte personalizado de acordo com visagismo e finalização com escova.',
      destaque: false
    },
    {
      id: 'mechas',
      nome: 'Coloração / Mechas',
      preco: 'R$ 350',
      descricao: 'Técnica de iluminação ou cobertura completa com produtos de alta proteção capilar.',
      destaque: true
    },
    {
      id: 'tratamento',
      nome: 'Tratamento / Hidratação',
      preco: 'R$ 180',
      descricao: 'Cronograma de reconstrução e nutrição profunda para devolução do brilho e maciez.',
      destaque: false
    },
    {
      id: 'penteado',
      nome: 'Penteado / Eventos',
      preco: 'R$ 220',
      descricao: 'Produção completa para festas, casamentos e eventos especiais com alta fixação.',
      destaque: false
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selecionarServico = (nomeServico) => {
    setFormData({ ...formData, procedimento: nomeServico });
    document.getElementById('agendamento').scrollIntoView({ behavior: 'smooth' });
  };

  // Gerador de link para o Google Agenda
  const gerarLinkGoogleCalendar = (dataStr, horarioStr, procedimento, nomeCliente) => {
    try {
      const dataInicio = new Date(`${dataStr}T${horarioStr}:00`);
      const dataFim = new Date(dataInicio.getTime() + 90 * 60000);

      const formatarDataIso = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');

      const start = formatarDataIso(dataInicio);
      const end = formatarDataIso(dataFim);

      const title = encodeURIComponent(`${procedimento} - Luciana Ribeiro Studio`);
      const details = encodeURIComponent(`Agendamento de ${nomeCliente} (${procedimento}) via site Luciana Ribeiro Studio.`);
      const location = encodeURIComponent(`Luciana Ribeiro Studio`);

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    } catch (e) {
      return '#';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.procedimento || !formData.data || !formData.horario) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Envia automaticamente para a API Serverless na Vercel
    try {
      await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error('Erro ao salvar na agenda:', err);
    }

    // Abre o WhatsApp para confirmação direta com a cliente
    const mensagem = encodeURIComponent(
      `Olá! Gostaria de confirmar um agendamento no Luciana Ribeiro Studio:\n\n` +
      `👤 *Cliente:* ${formData.nome}\n` +
      `✂️ *Procedimento:* ${formData.procedimento}\n` +
      `📅 *Data:* ${formData.data}\n` +
      `⏰ *Horário:* ${formData.horario}`
    );

    window.open(`https://wa.me/${TELEFONE_STUDIO}?text=${mensagem}`, '_blank');
    setSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#332f2b] flex flex-col justify-between font-sans">
      {/* CABEÇALHO / NAVBAR */}
      <header className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full border-b border-[#e8dfd1]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c5a059] text-white flex items-center font-bold text-xl justify-center shadow-md">
            LR
          </div>
          <span className="font-bold tracking-wider text-lg uppercase text-[#332f2b]">
            Luciana Ribeiro <span className="text-[#c5a059]">Studio</span>
          </span>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-[#665e55]">
          <a href="#agendamento" className="hover:text-[#c5a059] transition">Início</a>
          <a href="#servicos" className="hover:text-[#c5a059] transition">Serviços</a>
        </nav>

        <button 
          onClick={() => document.getElementById('agendamento').scrollIntoView({ behavior: 'smooth' })}
          className="border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-white font-semibold px-5 py-2 rounded-full text-sm transition-all shadow-sm cursor-pointer"
        >
          Agendar agora
        </button>
      </header>

      {/* SEÇÃO PRINCIPAL (HERO + FORMULÁRIO) */}
      <main id="agendamento" className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div className="lg:col-span-5 bg-[#f4efe6] p-8 rounded-3xl border border-[#e2d7c5] shadow-xl relative overflow-hidden">
          
          <span className="text-[#c5a059] text-xs font-bold tracking-widest uppercase mb-2 block">
            SUA MELHOR VERSÃO COMEÇA AQUI
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-[#2a2521]">
            AGENDE SEU HORÁRIO
          </h1>
          <p className="text-[#736a60] text-sm mb-8">
            Escolha o serviço e reserve seu momento no Luciana Ribeiro Studio.
          </p>

          {sucesso ? (
            <div className="bg-[#faf7f2] border border-[#c5a059]/40 p-6 rounded-2xl text-center my-6 space-y-4">
              <CheckCircle className="w-12 h-12 text-[#c5a059] mx-auto" />
              <h3 className="text-xl font-bold text-[#2a2521]">Agendamento Enviado!</h3>
              <p className="text-sm text-[#736a60]">
                Sua solicitação para <strong className="text-[#2a2521]">{formData.procedimento}</strong> no dia <strong className="text-[#2a2521]">{formData.data}</strong> foi encaminhada via WhatsApp.
              </p>

              <div className="space-y-2 pt-2">
                <a
                  href={gerarLinkGoogleCalendar(formData.data, formData.horario, formData.procedimento, formData.nome)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white hover:bg-[#f4efe6] text-[#c5a059] border border-[#c5a059] font-bold py-3 px-4 rounded-xl text-xs uppercase transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" /> Adicionar ao Meu Google Agenda
                </a>

                <button 
                  onClick={() => {
                    setFormData({ nome: '', procedimento: '', data: '', horario: '' });
                    setSucesso(false);
                  }}
                  className="w-full bg-[#c5a059] text-white font-bold py-3 rounded-xl text-xs uppercase hover:bg-[#b08c47] transition shadow-md cursor-pointer"
                >
                  Fazer Novo Agendamento
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold mb-2 text-[#524a42]">Seu nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Como podemos chamar você?"
                  className="w-full bg-white border border-[#e2d7c5] rounded-xl px-4 py-3 text-sm text-[#332f2b] focus:outline-none focus:border-[#c5a059] transition placeholder-[#a89f91] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-[#524a42]">Procedimento</label>
                <select
                  name="procedimento"
                  value={formData.procedimento}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#e2d7c5] rounded-xl px-4 py-3 text-sm text-[#332f2b] focus:outline-none focus:border-[#c5a059] transition shadow-sm"
                >
                  <option value="">Selecione o serviço...</option>
                  {SERVICOS.map((serv) => (
                    <option key={serv.id} value={serv.nome}>{serv.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2 text-[#524a42]">Data</label>
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#e2d7c5] rounded-xl px-4 py-3 text-sm text-[#332f2b] focus:outline-none focus:border-[#c5a059] transition shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-[#524a42]">Horário</label>
                  <input
                    type="time"
                    name="horario"
                    value={formData.horario}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#e2d7c5] rounded-xl px-4 py-3 text-sm text-[#332f2b] focus:outline-none focus:border-[#c5a059] transition shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#c5a059] hover:bg-[#b08c47] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 text-sm tracking-wider uppercase cursor-pointer"
              >
                Confirmar via WhatsApp →
              </button>
            </form>
          )}
        </div>

        {/* COLUNA DIREITA: IMAGEM LOCAL */}
        <div className="lg:col-span-7 relative">
          <div className="relative h-[550px] w-full rounded-3xl overflow-hidden border border-[#e2d7c5] shadow-2xl">
            <img 
              src={FOTO_STUDIO} 
              alt="Luciana Ribeiro Studio" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a2521]/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg">
              <p className="text-[#c5a059] font-bold text-sm">Experiência Exclusiva</p>
              <h3 className="text-xl font-bold text-[#2a2521] mt-1">Especialista em transformação e cuidado capilar</h3>
            </div>
          </div>
        </div>

      </main>

      {/* SEÇÃO DE SERVIÇOS & VALORES */}
      <section id="servicos" className="max-w-7xl mx-auto w-full px-6 py-16 border-t border-[#e8dfd1]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#c5a059] text-xs font-bold tracking-widest uppercase">Nossos Procedimentos</span>
          <h2 className="text-3xl font-extrabold text-[#2a2521] mt-2">Serviços Exclusivos</h2>
          <p className="text-[#736a60] text-sm mt-2">Escolha o tratamento ideal para o seu cabelo e agende com um clique.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICOS.map((serv) => (
            <div 
              key={serv.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                serv.destaque 
                  ? 'bg-white border-[#c5a059] shadow-xl relative scale-105' 
                  : 'bg-[#f4efe6] border-[#e2d7c5] hover:border-[#c5a059]/50 shadow-sm'
              }`}
            >
              {serv.destaque && (
                <span className="absolute -top-3 right-6 bg-[#c5a059] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Mais Pedido
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold text-[#2a2521]">{serv.nome}</h3>
                <p className="text-2xl font-extrabold text-[#c5a059] my-2">{serv.preco}</p>
                <p className="text-xs text-[#736a60] leading-relaxed mb-6">{serv.descricao}</p>
              </div>

              <button
                onClick={() => selecionarServico(serv.nome)}
                className="w-full bg-white hover:bg-[#c5a059] text-[#c5a059] hover:text-white border border-[#c5a059] font-bold py-2.5 rounded-xl text-xs uppercase transition-all shadow-sm cursor-pointer"
              >
                Selecionar e Agendar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="text-center py-6 text-xs text-[#8c8275] border-t border-[#e8dfd1]">
        © 2026 Luciana Ribeiro Studio. Todos os direitos reservados.
      </footer>
    </div>
  );
}