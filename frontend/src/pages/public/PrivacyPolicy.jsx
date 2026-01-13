import { useNavigate } from 'react-router-dom'
import { Calendar, ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-jet-black-50">
      {/* Header */}
      <header className="bg-white border-b border-jet-black-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-jet-black-600 hover:text-jet-black-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-periwinkle-500 to-periwinkle-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-jet-black-900">AgendaMais</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-jet-black-200 p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-jet-black-900 mb-2">Politica de Privacidade</h1>
          <p className="text-jet-black-500 mb-8">Ultima atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">1. Introdução</h2>
              <p className="text-jet-black-600 mb-4">
                A AgendaMais está comprometida em proteger a privacidade dos seus usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossa plataforma de agendamento online.
              </p>
              <p className="text-jet-black-600">
                Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política. Recomendamos a leitura atenta deste documento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">2. Dados que Coletamos</h2>
              <p className="text-jet-black-600 mb-4">
                Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
              </p>

              <h3 className="text-lg font-medium text-jet-black-900 mt-6 mb-3">2.1 Dados fornecidos por você:</h3>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li><strong>Dados de cadastro:</strong> nome, email, telefone, senha</li>
                <li><strong>Dados do negócio:</strong> nome da empresa, CNPJ, endereço, segmento de atuação</li>
                <li><strong>Dados de profissionais:</strong> nome, especialidade, horários de trabalho</li>
                <li><strong>Dados de clientes:</strong> nome, telefone, email, histórico de agendamentos</li>
                <li><strong>Dados de serviços:</strong> descrição, preços, duração</li>
                <li><strong>Dados financeiros:</strong> informações de pagamento processadas via Stripe</li>
              </ul>

              <h3 className="text-lg font-medium text-jet-black-900 mt-6 mb-3">2.2 Dados coletados automaticamente:</h3>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li><strong>Dados de uso:</strong> páginas visitadas, funcionalidades utilizadas, tempo de sessão</li>
                <li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador, sistema operacional</li>
                <li><strong>Cookies:</strong> identificadores de sessão e preferências</li>
                <li><strong>Logs:</strong> registros de acesso e atividades para segurança</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">3. Como Usamos seus Dados</h2>
              <p className="text-jet-black-600 mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Fornecer e manter nossos serviços de agendamento</li>
                <li>Processar pagamentos e gerenciar assinaturas</li>
                <li>Enviar lembretes de agendamentos via WhatsApp, SMS ou email</li>
                <li>Comunicar atualizações, novidades e suporte técnico</li>
                <li>Personalizar e melhorar a experiência do usuário</li>
                <li>Gerar relatórios e análises para seu negócio</li>
                <li>Detectar e prevenir fraudes e atividades suspeitas</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">4. Compartilhamento de Dados</h2>
              <p className="text-jet-black-600 mb-4">
                Não vendemos suas informações pessoais. Podemos compartilhar dados com:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li><strong>Processadores de pagamento:</strong> Stripe para processar transações financeiras</li>
                <li><strong>Provedores de comunicação:</strong> serviços de WhatsApp, SMS e email para lembretes</li>
                <li><strong>Serviços de hospedagem:</strong> provedores de infraestrutura cloud</li>
                <li><strong>Autoridades legais:</strong> quando exigido por lei ou ordem judicial</li>
              </ul>
              <p className="text-jet-black-600 mt-4">
                Todos os terceiros são obrigados contratualmente a proteger seus dados e utilizá-los apenas para os fins especificados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">5. Armazenamento e Segurança</h2>
              <p className="text-jet-black-600 mb-4">
                Implementamos medidas de segurança para proteger suas informações:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Criptografia SSL/TLS em todas as transmissões de dados</li>
                <li>Criptografia de senhas usando algoritmos seguros (bcrypt)</li>
                <li>Servidores protegidos com firewalls e monitoramento 24/7</li>
                <li>Backups diários automáticos</li>
                <li>Controle de acesso baseado em funções</li>
                <li>Auditorias regulares de segurança</li>
              </ul>
              <p className="text-jet-black-600 mt-4">
                Seus dados são armazenados em servidores localizados no Brasil ou em países com níveis adequados de proteção de dados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">6. Retenção de Dados</h2>
              <p className="text-jet-black-600 mb-4">
                Mantemos seus dados pelo tempo necessário para:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li><strong>Conta ativa:</strong> enquanto você mantiver uma conta conosco</li>
                <li><strong>Após cancelamento:</strong> 30 dias para possível reativação</li>
                <li><strong>Dados financeiros:</strong> 5 anos conforme legislação fiscal brasileira</li>
                <li><strong>Logs de segurança:</strong> 6 meses para investigação de incidentes</li>
              </ul>
              <p className="text-jet-black-600 mt-4">
                Após os períodos de retenção, os dados são anonimizados ou excluídos permanentemente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">7. Cookies</h2>
              <p className="text-jet-black-600 mb-4">
                Utilizamos cookies para:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li><strong>Cookies essenciais:</strong> necessários para funcionamento da plataforma</li>
                <li><strong>Cookies de sessão:</strong> mantêm você logado durante a navegação</li>
                <li><strong>Cookies de preferências:</strong> lembram suas configurações</li>
                <li><strong>Cookies analíticos:</strong> ajudam a entender como você usa a plataforma</li>
              </ul>
              <p className="text-jet-black-600 mt-4">
                Você pode gerenciar cookies através das configurações do seu navegador, mas isso pode afetar a funcionalidade do serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">8. Seus Direitos</h2>
              <p className="text-jet-black-600 mb-4">
                Conforme a LGPD, você tem direito a:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li><strong>Acesso:</strong> saber quais dados temos sobre você</li>
                <li><strong>Correção:</strong> atualizar dados incorretos ou incompletos</li>
                <li><strong>Exclusão:</strong> solicitar a remoção dos seus dados</li>
                <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
                <li><strong>Revogação:</strong> retirar consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> se opor a determinados tratamentos de dados</li>
              </ul>
              <p className="text-jet-black-600 mt-4">
                Para exercer esses direitos, entre em contato através do email: <a href="mailto:privacidade@agendamais.site" className="text-periwinkle-600 hover:underline">privacidade@agendamais.site</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">9. Menores de Idade</h2>
              <p className="text-jet-black-600">
                Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se você acredita que coletamos dados de um menor, entre em contato imediatamente para que possamos tomar as medidas necessárias.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">10. Alterações nesta Política</h2>
              <p className="text-jet-black-600">
                Podemos atualizar esta Política de Privacidade periodicamente. Alterações significativas serão comunicadas por email ou através de aviso na plataforma com antecedência mínima de 30 dias. Recomendamos revisar esta página regularmente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">11. Contato</h2>
              <p className="text-jet-black-600">
                Para dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus dados:
              </p>
              <ul className="list-none text-jet-black-600 mt-4 space-y-2">
                <li><strong>Email:</strong> privacidade@agendamais.site</li>
                <li><strong>Suporte:</strong> suporte@agendamais.site</li>
                <li><strong>Site:</strong> agendamais.site</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-jet-black-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-jet-black-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AgendaMais. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
