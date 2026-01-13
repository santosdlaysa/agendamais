import { useNavigate } from 'react-router-dom'
import { Calendar, ArrowLeft, Shield, Lock, Eye, Trash2, Download, UserCheck } from 'lucide-react'

export default function LGPD() {
  const navigate = useNavigate()

  const rights = [
    {
      icon: Eye,
      title: 'Acesso',
      description: 'Você pode solicitar uma cópia de todos os dados pessoais que mantemos sobre você.'
    },
    {
      icon: UserCheck,
      title: 'Correção',
      description: 'Você pode solicitar a correção de dados pessoais incorretos ou incompletos.'
    },
    {
      icon: Trash2,
      title: 'Eliminação',
      description: 'Você pode solicitar a exclusão dos seus dados pessoais, quando aplicável.'
    },
    {
      icon: Download,
      title: 'Portabilidade',
      description: 'Você pode solicitar seus dados em formato estruturado para transferência.'
    },
    {
      icon: Lock,
      title: 'Revogação',
      description: 'Você pode revogar o consentimento para tratamento de dados a qualquer momento.'
    },
    {
      icon: Shield,
      title: 'Oposição',
      description: 'Você pode se opor a determinados tratamentos de dados pessoais.'
    }
  ]

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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-periwinkle-600 to-periwinkle-700 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            LGPD - Lei Geral de Proteção de Dados
          </h1>
          <p className="text-periwinkle-100 text-lg max-w-2xl mx-auto">
            Conheça seus direitos e saiba como o AgendaMais protege suas informações pessoais em conformidade com a Lei 13.709/2018.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Rights Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-jet-black-900 mb-6 text-center">Seus Direitos como Titular de Dados</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rights.map((right, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-jet-black-200 hover:border-periwinkle-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-periwinkle-100 rounded-xl flex items-center justify-center mb-4">
                  <right.icon className="w-6 h-6 text-periwinkle-600" />
                </div>
                <h3 className="font-semibold text-jet-black-900 mb-2">{right.title}</h3>
                <p className="text-jet-black-600 text-sm">{right.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-jet-black-200 p-8 sm:p-12">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">O que é a LGPD?</h2>
              <p className="text-jet-black-600 mb-4">
                A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) é a legislação brasileira que regula o tratamento de dados pessoais por pessoas físicas ou jurídicas, com o objetivo de proteger os direitos fundamentais de liberdade e de privacidade.
              </p>
              <p className="text-jet-black-600">
                O AgendaMais está em conformidade com a LGPD e se compromete a tratar seus dados pessoais de forma transparente, segura e respeitando seus direitos como titular.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">Bases Legais para Tratamento</h2>
              <p className="text-jet-black-600 mb-4">
                Tratamos seus dados pessoais com base nas seguintes hipóteses legais previstas na LGPD:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-3">
                <li>
                  <strong>Execução de contrato (Art. 7º, V):</strong> para fornecer os serviços de agendamento contratados, processar pagamentos e gerenciar sua conta.
                </li>
                <li>
                  <strong>Consentimento (Art. 7º, I):</strong> para envio de comunicações de marketing, newsletters e pesquisas de satisfação.
                </li>
                <li>
                  <strong>Legítimo interesse (Art. 7º, IX):</strong> para melhorar nossos serviços, garantir segurança da plataforma e prevenir fraudes.
                </li>
                <li>
                  <strong>Cumprimento de obrigação legal (Art. 7º, II):</strong> para atender exigências fiscais, contábeis e regulatórias.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">Dados que Coletamos</h2>

              <h3 className="text-lg font-medium text-jet-black-900 mt-6 mb-3">Dados dos Proprietários/Administradores:</h3>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Nome completo e email</li>
                <li>Telefone para contato</li>
                <li>Dados do negócio (nome, CNPJ, endereço)</li>
                <li>Informações de pagamento (processadas via Stripe)</li>
              </ul>

              <h3 className="text-lg font-medium text-jet-black-900 mt-6 mb-3">Dados dos Clientes Finais:</h3>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Nome e telefone (para agendamento)</li>
                <li>Email (opcional, para comunicações)</li>
                <li>Histórico de agendamentos</li>
              </ul>

              <div className="bg-periwinkle-50 border border-periwinkle-200 rounded-lg p-4 mt-4">
                <p className="text-periwinkle-800 text-sm">
                  <strong>Importante:</strong> Os dados dos clientes finais são de responsabilidade compartilhada entre o AgendaMais (operador) e o estabelecimento (controlador). O estabelecimento deve informar seus clientes sobre o uso da plataforma.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">Medidas de Segurança</h2>
              <p className="text-jet-black-600 mb-4">
                Implementamos medidas técnicas e administrativas para proteger seus dados:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Criptografia SSL/TLS em todas as comunicações</li>
                <li>Senhas armazenadas com hash seguro (bcrypt)</li>
                <li>Autenticação segura com tokens JWT</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups diários criptografados</li>
                <li>Acesso restrito aos dados por funcionários autorizados</li>
                <li>Treinamento de equipe em proteção de dados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">Compartilhamento de Dados</h2>
              <p className="text-jet-black-600 mb-4">
                Seus dados podem ser compartilhados com:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li><strong>Stripe:</strong> processamento de pagamentos (certificado PCI-DSS)</li>
                <li><strong>Provedores de SMS/WhatsApp:</strong> envio de lembretes autorizados</li>
                <li><strong>Serviços de email:</strong> comunicações transacionais</li>
                <li><strong>Provedores de hospedagem:</strong> armazenamento seguro em cloud</li>
              </ul>
              <p className="text-jet-black-600 mt-4">
                Todos os parceiros são contratualmente obrigados a cumprir a LGPD e manter a confidencialidade dos dados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">Transferência Internacional</h2>
              <p className="text-jet-black-600">
                Alguns de nossos prestadores de serviços podem estar localizados fora do Brasil. Nesses casos, garantimos que a transferência internacional de dados ocorra apenas para países com nível adequado de proteção ou mediante cláusulas contratuais padrão aprovadas pela ANPD, conforme Art. 33 da LGPD.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">Retenção e Eliminação</h2>
              <p className="text-jet-black-600 mb-4">
                Seus dados são mantidos pelo período necessário para cumprir as finalidades descritas:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li><strong>Dados de conta:</strong> enquanto a conta estiver ativa</li>
                <li><strong>Após cancelamento:</strong> 30 dias para recuperação, depois eliminados</li>
                <li><strong>Dados fiscais:</strong> 5 anos (obrigação legal)</li>
                <li><strong>Logs de segurança:</strong> 6 meses</li>
              </ul>
              <p className="text-jet-black-600 mt-4">
                Você pode solicitar a eliminação dos seus dados a qualquer momento, exceto quando houver obrigação legal de retenção.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">Como Exercer seus Direitos</h2>
              <p className="text-jet-black-600 mb-4">
                Para exercer qualquer um dos seus direitos previstos na LGPD:
              </p>
              <ol className="list-decimal pl-6 text-jet-black-600 space-y-3">
                <li>
                  <strong>Email:</strong> Envie sua solicitação para{' '}
                  <a href="mailto:lgpd@agendamais.site" className="text-periwinkle-600 hover:underline">
                    lgpd@agendamais.site
                  </a>
                </li>
                <li>
                  <strong>Identificação:</strong> Inclua seu nome completo e email cadastrado para verificação de identidade
                </li>
                <li>
                  <strong>Prazo:</strong> Responderemos em até 15 dias úteis, conforme Art. 18, §5º da LGPD
                </li>
              </ol>

              <div className="bg-jet-black-50 border border-jet-black-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-jet-black-900 mb-2">Solicitações disponíveis:</h4>
                <ul className="list-disc pl-6 text-jet-black-600 space-y-1 text-sm">
                  <li>Confirmação da existência de tratamento</li>
                  <li>Acesso aos dados pessoais</li>
                  <li>Correção de dados incompletos ou incorretos</li>
                  <li>Anonimização, bloqueio ou eliminação de dados</li>
                  <li>Portabilidade dos dados</li>
                  <li>Eliminação dos dados tratados com consentimento</li>
                  <li>Informação sobre compartilhamento com terceiros</li>
                  <li>Revogação do consentimento</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">Encarregado de Dados (DPO)</h2>
              <p className="text-jet-black-600 mb-4">
                Nosso Encarregado pelo Tratamento de Dados Pessoais está disponível para:
              </p>
              <ul className="list-disc pl-6 text-jet-black-600 space-y-2">
                <li>Receber reclamações e comunicações de titulares</li>
                <li>Prestar esclarecimentos às autoridades</li>
                <li>Orientar funcionários sobre práticas de proteção de dados</li>
              </ul>
              <div className="bg-white border border-jet-black-200 rounded-lg p-4 mt-4">
                <p className="text-jet-black-600">
                  <strong>Contato do DPO:</strong><br />
                  Email: <a href="mailto:dpo@agendamais.site" className="text-periwinkle-600 hover:underline">dpo@agendamais.site</a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">ANPD - Autoridade Nacional</h2>
              <p className="text-jet-black-600">
                Se você acredita que seus direitos não foram atendidos adequadamente, você pode apresentar uma reclamação à Autoridade Nacional de Proteção de Dados (ANPD):
              </p>
              <ul className="list-none text-jet-black-600 mt-4 space-y-2">
                <li><strong>Site:</strong> <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-periwinkle-600 hover:underline">www.gov.br/anpd</a></li>
                <li><strong>Canal de denúncias:</strong> Peticionamento eletrônico no site da ANPD</li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="text-xl font-semibold text-jet-black-900 mb-4">Atualização desta Página</h2>
              <p className="text-jet-black-600">
                Esta página sobre LGPD pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na legislação. A data da última atualização está indicada abaixo.
              </p>
              <p className="text-jet-black-500 mt-4">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
            </section>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-br from-periwinkle-50 to-purple-50 rounded-2xl p-8 text-center border border-periwinkle-100">
          <h3 className="text-xl font-semibold text-jet-black-900 mb-3">Ainda tem dúvidas?</h3>
          <p className="text-jet-black-600 mb-6">
            Nossa equipe está pronta para ajudar com qualquer questão sobre privacidade e proteção de dados.
          </p>
          <a
            href="mailto:lgpd@agendamais.site"
            className="inline-flex items-center gap-2 bg-periwinkle-600 hover:bg-periwinkle-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Shield className="w-5 h-5" />
            Falar com DPO
          </a>
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
