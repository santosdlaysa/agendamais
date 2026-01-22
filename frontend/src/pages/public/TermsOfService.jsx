import { useNavigate } from 'react-router-dom'
import { Calendar, ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
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
              <span className="text-lg font-bold text-jet-black-900">Agendar Mais</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-jet-black-200 p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-jet-black-900 mb-2">Termos de Uso</h1>
          <p className="text-jet-black-500 mb-8">Ultima atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-jet-black-600 mb-4">
                Ao acessar e utilizar a plataforma Agendar Mais, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
              </p>
              <p className="text-jet-black-600">
                Estes Termos de Uso constituem um acordo legal entre você ("Usuário") e Agendar Mais ("Empresa", "nós" ou "nosso"), regulando o uso de nossa plataforma de agendamento online.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-jet-black-600 mb-4">
                O Agendar Mais é uma plataforma de gestão de agendamentos online que permite:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Criação e gestão de agendamentos de serviços</li>
                <li>Cadastro de profissionais, serviços e clientes</li>
                <li>Envio de lembretes automáticos via WhatsApp, SMS e email</li>
                <li>Página pública para agendamento online pelos clientes</li>
                <li>Relatórios financeiros e de desempenho</li>
                <li>Integração com sistemas de pagamento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">3. Cadastro e Conta</h2>
              <p className="text-jet-black-600 mb-4">
                Para utilizar o Agendar Mais, você deve:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Ter pelo menos 18 anos de idade ou capacidade legal</li>
                <li>Fornecer informações verdadeiras, precisas e completas</li>
                <li>Manter suas credenciais de acesso em sigilo</li>
                <li>Ser responsável por todas as atividades realizadas em sua conta</li>
                <li>Notificar imediatamente qualquer uso não autorizado</li>
              </ul>
              <p className="text-jet-black-600 mt-4">
                Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos ou que apresentem atividades suspeitas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">4. Planos e Pagamentos</h2>
              <p className="text-jet-black-600 mb-4">
                O Agendar Mais oferece diferentes planos de assinatura com funcionalidades e limites específicos:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Os preços estão sujeitos a alterações com aviso prévio de 30 dias</li>
                <li>As cobranças são realizadas mensalmente de forma recorrente</li>
                <li>O período de teste gratuito é oferecido conforme as condições vigentes</li>
                <li>Não há reembolso para períodos parciais não utilizados</li>
                <li>O cancelamento pode ser realizado a qualquer momento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">5. Uso Aceitável</h2>
              <p className="text-jet-black-600 mb-4">
                Você concorda em não utilizar o Agendar Mais para:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Atividades ilegais ou que violem leis brasileiras</li>
                <li>Envio de spam ou comunicações não solicitadas</li>
                <li>Distribuição de vírus ou código malicioso</li>
                <li>Tentativas de acesso não autorizado ao sistema</li>
                <li>Coleta de dados de outros usuários sem autorização</li>
                <li>Uso que possa prejudicar a operação da plataforma</li>
                <li>Revenda ou redistribuição do serviço sem autorização</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">6. Propriedade Intelectual</h2>
              <p className="text-jet-black-600 mb-4">
                Todo o conteúdo da plataforma Agendar Mais, incluindo mas não limitado a textos, gráficos, logos, ícones, imagens, código-fonte e software, é de propriedade exclusiva da Empresa ou de seus licenciadores e está protegido pelas leis de propriedade intelectual.
              </p>
              <p className="text-jet-black-600">
                Os dados e conteúdos inseridos pelo Usuário permanecem de propriedade do Usuário, sendo concedida à Empresa licença limitada para processar tais dados conforme necessário para prestação do serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">7. Limitação de Responsabilidade</h2>
              <p className="text-jet-black-600 mb-4">
                O Agendar Mais é fornecido "como está". Não garantimos que o serviço será ininterrupto, seguro ou livre de erros. Nossa responsabilidade total perante você está limitada ao valor pago pelo serviço nos últimos 12 meses.
              </p>
              <p className="text-jet-black-600">
                Não nos responsabilizamos por:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2 mt-4">
                <li>Perdas indiretas, incidentais ou consequenciais</li>
                <li>Interrupções causadas por fatores externos à nossa operação</li>
                <li>Ações de terceiros ou falhas em serviços de terceiros</li>
                <li>Perda de dados devido a falhas do usuário em manter backups</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">8. Disponibilidade do Serviço</h2>
              <p className="text-jet-black-600">
                Nos esforçamos para manter o serviço disponível 24/7, porém podem ocorrer interrupções para manutenção, atualizações ou por motivos técnicos. Sempre que possível, comunicaremos previamente sobre manutenções programadas. Em caso de indisponibilidade prolongada não programada, poderemos oferecer créditos proporcionais aos usuários afetados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">9. Modificações nos Termos</h2>
              <p className="text-jet-black-600">
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas serão comunicadas com antecedência mínima de 30 dias através do email cadastrado ou notificação na plataforma. O uso continuado após as alterações implica aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">10. Cancelamento e Encerramento</h2>
              <p className="text-jet-black-600 mb-4">
                Você pode cancelar sua conta a qualquer momento através das configurações da plataforma. Após o cancelamento:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Seu acesso será mantido até o final do período pago</li>
                <li>Seus dados serão retidos por 30 dias para possível reativação</li>
                <li>Após 30 dias, os dados serão permanentemente excluídos</li>
                <li>Você pode solicitar exportação dos dados antes da exclusão</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">11. Lei Aplicável e Foro</h2>
              <p className="text-jet-black-600">
                Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida no foro da comarca de São Paulo/SP, com renúncia a qualquer outro, por mais privilegiado que seja.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">12. Contato</h2>
              <p className="text-jet-black-600">
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <ul className="list-none text-jet-black-600 mt-4 space-y-2">
                <li><strong>Email:</strong> suporte@agendarmais.com</li>
                <li><strong>Site:</strong> agendarmais.com</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-jet-black-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-jet-black-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Agendar Mais. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
