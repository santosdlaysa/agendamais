import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Users,
  UserCheck,
  Briefcase,
  FileText,
  BarChart3,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Plus,
  Search,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Filter
} from 'lucide-react'

// ── Mock Data ──────────────────────────────────────────────

const MOCK_APPOINTMENTS = [
  { id: 1, client: 'Maria Silva', service: 'Corte + Escova', professional: 'Ana Paula', date: '01 Abr', time: '14:00', end: '15:00', price: 'R$ 85,00', duration: '60 min', status: 'scheduled', initial: 'M' },
  { id: 2, client: 'João Pedro', service: 'Barba Completa', professional: 'Carlos Lima', date: '01 Abr', time: '15:30', end: '16:00', price: 'R$ 45,00', duration: '30 min', status: 'scheduled', initial: 'J' },
  { id: 3, client: 'Ana Beatriz', service: 'Coloração', professional: 'Ana Paula', date: '31 Mar', time: '10:00', end: '11:30', price: 'R$ 150,00', duration: '90 min', status: 'completed', initial: 'A' },
  { id: 4, client: 'Carlos Eduardo', service: 'Corte Masculino', professional: 'Carlos Lima', date: '31 Mar', time: '16:00', end: '16:30', price: 'R$ 40,00', duration: '30 min', status: 'completed', initial: 'C' },
  { id: 5, client: 'Fernanda Dias', service: 'Escova Progressiva', professional: 'Ana Paula', date: '30 Mar', time: '09:00', end: '11:00', price: 'R$ 200,00', duration: '120 min', status: 'completed', initial: 'F' }
]

const MOCK_CLIENTS = [
  { id: 1, name: 'Maria Silva', phone: '(11) 99876-5432', email: 'maria@email.com', appointments: 12, lastVisit: '01 Abr', initial: 'M' },
  { id: 2, name: 'João Pedro', phone: '(11) 98765-4321', email: 'joao@email.com', appointments: 8, lastVisit: '01 Abr', initial: 'J' },
  { id: 3, name: 'Ana Beatriz', phone: '(11) 97654-3210', email: 'ana.b@email.com', appointments: 15, lastVisit: '31 Mar', initial: 'A' },
  { id: 4, name: 'Carlos Eduardo', phone: '(11) 96543-2109', email: 'carlos@email.com', appointments: 5, lastVisit: '31 Mar', initial: 'C' },
  { id: 5, name: 'Fernanda Dias', phone: '(11) 95432-1098', email: 'fer@email.com', appointments: 3, lastVisit: '30 Mar', initial: 'F' }
]

const MOCK_PROFESSIONALS = [
  { id: 1, name: 'Ana Paula', role: 'Cabeleireira', phone: '(11) 91234-5678', services: ['Corte', 'Coloração', 'Escova'], appointments: 28, initial: 'A', active: true },
  { id: 2, name: 'Carlos Lima', role: 'Barbeiro', phone: '(11) 92345-6789', services: ['Corte Masc.', 'Barba'], appointments: 22, initial: 'C', active: true },
  { id: 3, name: 'Juliana Santos', role: 'Manicure', phone: '(11) 93456-7890', services: ['Manicure', 'Pedicure'], appointments: 15, initial: 'J', active: true }
]

const MOCK_SERVICES = [
  { id: 1, name: 'Corte + Escova', price: 'R$ 85,00', duration: '60 min', professionals: 1, active: true },
  { id: 2, name: 'Barba Completa', price: 'R$ 45,00', duration: '30 min', professionals: 1, active: true },
  { id: 3, name: 'Coloração', price: 'R$ 150,00', duration: '90 min', professionals: 1, active: true },
  { id: 4, name: 'Corte Masculino', price: 'R$ 40,00', duration: '30 min', professionals: 1, active: true },
  { id: 5, name: 'Escova Progressiva', price: 'R$ 200,00', duration: '120 min', professionals: 1, active: true },
  { id: 6, name: 'Manicure', price: 'R$ 35,00', duration: '45 min', professionals: 1, active: true }
]

const MOCK_REMINDERS = [
  { id: 1, client: 'Maria Silva', phone: '(11) 99876-5432', date: '01 Abr 14:00', type: 'WhatsApp', status: 'sent', scheduledFor: '01 Abr 08:00' },
  { id: 2, client: 'João Pedro', phone: '(11) 98765-4321', date: '01 Abr 15:30', type: 'WhatsApp', status: 'pending', scheduledFor: '01 Abr 09:30' },
  { id: 3, client: 'Fernanda Dias', phone: '(11) 95432-1098', date: '02 Abr 09:00', type: 'WhatsApp', status: 'pending', scheduledFor: '01 Abr 15:00' },
  { id: 4, client: 'Lucas Mendes', phone: '(11) 94321-0987', date: '02 Abr 11:00', type: 'SMS', status: 'failed', scheduledFor: '01 Abr 17:00' }
]

const NAV_ITEMS = [
  { icon: FileText, label: 'Dashboard', id: 'dashboard' },
  { icon: Calendar, label: 'Agendamentos', id: 'appointments' },
  { icon: MessageSquare, label: 'Lembretes', id: 'reminders' },
  { icon: BarChart3, label: 'Relatórios', id: 'reports' },
  { icon: Users, label: 'Clientes', id: 'clients' },
  { icon: UserCheck, label: 'Profissionais', id: 'professionals' },
  { icon: Briefcase, label: 'Serviços', id: 'services' }
]

const STATUS_STYLES = {
  scheduled: 'text-sky-600 bg-sky-50',
  completed: 'text-emerald-600 bg-emerald-50',
  cancelled: 'text-rose-600 bg-rose-50'
}

const STATUS_LABELS = {
  scheduled: 'Agendado',
  completed: 'Concluído',
  cancelled: 'Cancelado'
}

const REMINDER_STATUS_STYLES = {
  sent: 'text-emerald-600 bg-emerald-50',
  pending: 'text-amber-600 bg-amber-50',
  failed: 'text-rose-600 bg-rose-50'
}

const REMINDER_STATUS_LABELS = {
  sent: 'Enviado',
  pending: 'Pendente',
  failed: 'Falhou'
}

// ── Animations ─────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
}

const pageTransition = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -12, transition: { duration: 0.15 } }
}

// ── Shared Components ──────────────────────────────────────

function PageHeader({ title, subtitle, buttonLabel, icon: Icon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
      <div>
        <h2 className="text-base md:text-lg font-bold text-jet-black-900">{title}</h2>
        <p className="text-[11px] text-jet-black-500">{subtitle}</p>
      </div>
      {buttonLabel && (
        <motion.button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-periwinkle-600 hover:bg-periwinkle-700 text-white text-xs font-semibold rounded-lg transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {Icon && <Icon className="w-3 h-3" />}
          {buttonLabel}
        </motion.button>
      )}
    </div>
  )
}

function SearchBar({ placeholder }) {
  return (
    <div className="relative mb-3">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jet-black-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-jet-black-200 rounded-lg focus:outline-none focus:border-periwinkle-300 focus:ring-1 focus:ring-periwinkle-200 transition-colors"
        readOnly
      />
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────────

function DemoSidebar({ activeNav, onNavClick }) {
  return (
    <div className="hidden lg:flex flex-col w-44 bg-white border-r border-jet-black-200 flex-shrink-0">
      <div className="flex items-center gap-2 h-12 px-3 border-b border-jet-black-200">
        <Calendar className="h-5 w-5 text-periwinkle-600 flex-shrink-0" />
        <span className="text-sm font-bold text-jet-black-900 truncate">Agendar Mais</span>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onNavClick(item.id)}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeNav === item.id
                ? 'bg-periwinkle-100 text-periwinkle-700'
                : 'text-jet-black-600 hover:bg-jet-black-100 hover:text-jet-black-900'
            }`}
            whileTap={{ scale: 0.97 }}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
          </motion.button>
        ))}
      </nav>

      <div className="border-t border-jet-black-200 p-2">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-jet-black-100 transition-colors cursor-pointer">
          <div className="w-7 h-7 bg-periwinkle-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-jet-black-900 truncate">Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page: Dashboard ────────────────────────────────────────

function DemoDashboard() {
  return (
    <motion.div
      key="dashboard"
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Welcome Banner */}
      <motion.div
        variants={fadeUp}
        className="bg-gradient-to-r from-periwinkle-600 to-space-indigo-600 rounded-xl p-4 md:p-5 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-space-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-periwinkle-200 text-[11px] mb-0.5">terça-feira, 1 de abril</p>
            <h2 className="text-lg md:text-xl font-bold mb-1">Bom dia!</h2>
            <p className="text-periwinkle-100 text-xs">Você tem 2 agendamentos pendentes</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white/10 backdrop-blur rounded-lg p-2.5 text-center min-w-[56px]">
              <p className="text-lg font-bold leading-none">2</p>
              <p className="text-[10px] text-periwinkle-200 mt-0.5">Pendentes</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-2.5 text-center min-w-[56px]">
              <p className="text-lg font-bold leading-none">85%</p>
              <p className="text-[10px] text-periwinkle-200 mt-0.5">Conclusão</p>
            </div>
            <div className="hidden sm:block bg-white/10 backdrop-blur rounded-lg p-2.5 text-center min-w-[56px]">
              <p className="text-base font-bold leading-none">R$ 4.2k</p>
              <p className="text-[10px] text-periwinkle-200 mt-0.5">Receita</p>
            </div>
          </div>
        </div>

        <motion.button
          className="mt-3 inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-3 h-3" />
          Novo Agendamento
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {[
          { icon: Users, label: 'Clientes', value: '124', iconBg: 'bg-amber-100', iconText: 'text-amber-600', hoverBorder: 'hover:border-amber-200', hoverShadow: 'hover:shadow-amber-100/50' },
          { icon: Sparkles, label: 'Serviços', value: '18', iconBg: 'bg-periwinkle-100', iconText: 'text-periwinkle-600', hoverBorder: 'hover:border-periwinkle-200', hoverShadow: 'hover:shadow-periwinkle-100/50' },
          { icon: Calendar, label: 'Este mês', value: '47', iconBg: 'bg-sky-100', iconText: 'text-sky-600', hoverBorder: 'hover:border-sky-200', hoverShadow: 'hover:shadow-sky-100/50' },
          { icon: BarChart3, label: 'Receita', value: 'R$ 4.280', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', hoverBorder: 'hover:border-emerald-200', hoverShadow: 'hover:shadow-emerald-100/50' }
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className={`bg-white rounded-xl p-3 border border-jet-black-100 ${stat.hoverBorder} hover:shadow-lg ${stat.hoverShadow} cursor-pointer transition-all duration-300 group`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-4 h-4 ${stat.iconText}`} />
            </div>
            <p className="text-lg md:text-xl font-bold text-jet-black-900 leading-tight">{stat.value}</p>
            <p className="text-[11px] text-jet-black-500">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Grid: Appointments + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-3">
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-white rounded-xl border border-jet-black-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-jet-black-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-jet-black-900">Agendamentos Recentes</h3>
            <span className="text-xs text-periwinkle-600 font-medium flex items-center gap-1 cursor-pointer hover:text-periwinkle-700 transition-colors">
              Ver todos <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="divide-y divide-jet-black-50">
            {MOCK_APPOINTMENTS.slice(0, 4).map((apt) => (
              <motion.div
                key={apt.id}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-jet-black-50 cursor-pointer transition-colors"
                whileHover={{ x: 2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-periwinkle-400 to-space-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                    {apt.initial}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-jet-black-900">{apt.client}</p>
                    <p className="text-[11px] text-jet-black-500">{apt.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-jet-black-900">{apt.date}</p>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-[11px] text-jet-black-500">{apt.time}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_STYLES[apt.status]}`}>
                      {STATUS_LABELS[apt.status]}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-jet-black-100 p-4">
          <h3 className="text-sm font-semibold text-jet-black-900 mb-3">Ações Rápidas</h3>
          <div className="space-y-1.5">
            {[
              { icon: Users, label: 'Novo Cliente', iconBg: 'bg-amber-100', iconText: 'text-amber-600', hoverBg: 'hover:bg-amber-50' },
              { icon: UserCheck, label: 'Novo Profissional', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', hoverBg: 'hover:bg-emerald-50' },
              { icon: Briefcase, label: 'Novo Serviço', iconBg: 'bg-periwinkle-100', iconText: 'text-periwinkle-600', hoverBg: 'hover:bg-periwinkle-50' },
              { icon: Calendar, label: 'Novo Agendamento', iconBg: 'bg-sky-100', iconText: 'text-sky-600', hoverBg: 'hover:bg-sky-50' }
            ].map((action) => (
              <motion.button
                key={action.label}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl ${action.hoverBg} text-left transition-colors group`}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-8 h-8 ${action.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-4 h-4 ${action.iconText}`} />
                </div>
                <span className="text-xs font-medium text-jet-black-700">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Page: Agendamentos ─────────────────────────────────────

function DemoAppointments() {
  return (
    <motion.div key="appointments" {...pageTransition}>
      <PageHeader title="Agendamentos" subtitle="Gerencie todos os agendamentos" buttonLabel="+ Novo Agendamento" icon={Plus} />

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative flex-1 min-w-[140px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jet-black-400" />
          <input type="text" placeholder="Cliente ou profissional..." className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-jet-black-200 rounded-lg focus:outline-none" readOnly />
        </div>
        <select className="px-2 py-1.5 text-xs bg-white border border-jet-black-200 rounded-lg text-jet-black-600 cursor-pointer" disabled>
          <option>Todos os status</option>
        </select>
        <span className="text-[11px] text-jet-black-500">{MOCK_APPOINTMENTS.length} agendamentos</span>
      </div>

      <div className="space-y-2">
        {MOCK_APPOINTMENTS.map((apt) => (
          <motion.div
            key={apt.id}
            className="bg-white rounded-xl border border-jet-black-100 p-3 hover:border-periwinkle-200 hover:shadow-md cursor-pointer transition-all"
            whileHover={{ y: -1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-periwinkle-400 to-space-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                  {apt.initial}
                </div>
                <div>
                  <p className="text-xs font-semibold text-jet-black-900">{apt.client}</p>
                  <p className="text-[11px] text-jet-black-500">{apt.professional}</p>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${STATUS_STYLES[apt.status]}`}>
                {apt.status === 'scheduled' ? <Calendar className="w-2.5 h-2.5" /> : <CheckCircle className="w-2.5 h-2.5" />}
                {STATUS_LABELS[apt.status]}
              </span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-jet-black-50 rounded-lg p-2 text-[11px]">
              <div><span className="text-jet-black-400">Serviço</span><p className="font-medium text-jet-black-900 truncate">{apt.service}</p></div>
              <div><span className="text-jet-black-400">Data</span><p className="font-medium text-jet-black-900">{apt.date}</p></div>
              <div><span className="text-jet-black-400">Horário</span><p className="font-medium text-jet-black-900">{apt.time} - {apt.end}</p></div>
              <div className="hidden md:block"><span className="text-jet-black-400">Duração</span><p className="font-medium text-jet-black-900">{apt.duration}</p></div>
              <div className="hidden md:block"><span className="text-jet-black-400">Valor</span><p className="font-medium text-jet-black-900">{apt.price}</p></div>
              <div className="hidden md:block"><span className="text-jet-black-400">Profissional</span><p className="font-medium text-jet-black-900 truncate">{apt.professional}</p></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Page: Clientes ─────────────────────────────────────────

function DemoClients() {
  return (
    <motion.div key="clients" {...pageTransition}>
      <PageHeader title="Clientes" subtitle="Gerencie sua base de clientes" buttonLabel="+ Novo Cliente" icon={Plus} />
      <SearchBar placeholder="Buscar clientes por nome, telefone ou email..." />

      <div className="space-y-2">
        {MOCK_CLIENTS.map((client) => (
          <motion.div
            key={client.id}
            className="bg-white rounded-xl border border-jet-black-100 p-3 hover:border-periwinkle-200 hover:shadow-md cursor-pointer transition-all"
            whileHover={{ y: -1 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-periwinkle-400 to-space-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {client.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-jet-black-900">{client.name}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-jet-black-500">
                  <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                  <span className="hidden sm:inline-flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-xs font-medium text-jet-black-900">{client.appointments} agendamentos</p>
                <p className="text-[11px] text-jet-black-500">Último: {client.lastVisit}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Page: Profissionais ────────────────────────────────────

function DemoProfessionals() {
  return (
    <motion.div key="professionals" {...pageTransition}>
      <PageHeader title="Profissionais" subtitle="Gerencie os profissionais do seu negócio" buttonLabel="+ Novo Profissional" icon={Plus} />
      <SearchBar placeholder="Buscar profissionais..." />

      <div className="space-y-2">
        {MOCK_PROFESSIONALS.map((pro) => (
          <motion.div
            key={pro.id}
            className="bg-white rounded-xl border border-jet-black-100 p-3 hover:border-periwinkle-200 hover:shadow-md cursor-pointer transition-all"
            whileHover={{ y: -1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {pro.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-jet-black-900">{pro.name}</p>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Ativo</span>
                </div>
                <p className="text-[11px] text-jet-black-500">{pro.role}</p>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-xs font-medium text-jet-black-900">{pro.appointments} agendamentos</p>
                <p className="text-[11px] text-jet-black-500 inline-flex items-center gap-1"><Phone className="w-3 h-3" />{pro.phone}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-12">
              {pro.services.map((s) => (
                <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-periwinkle-100 text-periwinkle-700">{s}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Page: Serviços ─────────────────────────────────────────

function DemoServices() {
  return (
    <motion.div key="services" {...pageTransition}>
      <PageHeader title="Serviços" subtitle="Gerencie os serviços oferecidos" buttonLabel="+ Novo Serviço" icon={Plus} />
      <SearchBar placeholder="Buscar serviços..." />

      <div className="space-y-2">
        {MOCK_SERVICES.map((svc) => (
          <motion.div
            key={svc.id}
            className="bg-white rounded-xl border border-jet-black-100 p-3 hover:border-periwinkle-200 hover:shadow-md cursor-pointer transition-all"
            whileHover={{ y: -1 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-periwinkle-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-periwinkle-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-jet-black-900">{svc.name}</p>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Ativo</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-jet-black-500">
                  <span className="inline-flex items-center gap-1"><DollarSign className="w-3 h-3" />{svc.price}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{svc.duration}</span>
                  <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{svc.professionals} prof.</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Page: Lembretes ────────────────────────────────────────

function DemoReminders() {
  return (
    <motion.div key="reminders" {...pageTransition}>
      <PageHeader title="Lembretes Automáticos" subtitle="Gerencie os lembretes de agendamento" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {[
          { icon: MessageSquare, label: 'Total', value: '156', iconBg: 'bg-periwinkle-100', iconText: 'text-periwinkle-600' },
          { icon: CheckCircle, label: 'Enviados', value: '142', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
          { icon: Clock, label: 'Pendentes', value: '12', iconBg: 'bg-amber-100', iconText: 'text-amber-600' },
          { icon: XCircle, label: 'Falharam', value: '2', iconBg: 'bg-rose-100', iconText: 'text-rose-600' }
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-jet-black-100 p-2.5 flex items-center gap-2.5">
            <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-4 h-4 ${s.iconText}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-jet-black-900 leading-tight">{s.value}</p>
              <p className="text-[10px] text-jet-black-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduler status */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-[11px] text-jet-black-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Agendador: <span className="font-semibold text-emerald-600">Ativo</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-jet-black-100 overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-jet-black-50 text-jet-black-500 text-left">
              <th className="px-3 py-2 font-semibold">Cliente</th>
              <th className="px-3 py-2 font-semibold hidden sm:table-cell">Agendamento</th>
              <th className="px-3 py-2 font-semibold hidden md:table-cell">Tipo</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold hidden sm:table-cell">Envio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-jet-black-50">
            {MOCK_REMINDERS.map((r) => (
              <tr key={r.id} className="hover:bg-jet-black-50 transition-colors cursor-pointer">
                <td className="px-3 py-2">
                  <p className="font-medium text-jet-black-900">{r.client}</p>
                  <p className="text-jet-black-400">{r.phone}</p>
                </td>
                <td className="px-3 py-2 text-jet-black-600 hidden sm:table-cell">{r.date}</td>
                <td className="px-3 py-2 hidden md:table-cell">
                  <span className="inline-flex items-center gap-1 text-jet-black-600">
                    <MessageSquare className="w-3 h-3" />{r.type}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center gap-1 font-medium px-1.5 py-0.5 rounded-full ${REMINDER_STATUS_STYLES[r.status]}`}>
                    {r.status === 'sent' ? <CheckCircle className="w-2.5 h-2.5" /> : r.status === 'pending' ? <Clock className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                    {REMINDER_STATUS_LABELS[r.status]}
                  </span>
                </td>
                <td className="px-3 py-2 text-jet-black-500 hidden sm:table-cell">{r.scheduledFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// ── Page: Relatórios ───────────────────────────────────────

function DemoReports() {
  const serviceData = [
    { name: 'Corte + Escova', count: 18, revenue: 'R$ 1.530,00', avg: 'R$ 85,00' },
    { name: 'Coloração', count: 10, revenue: 'R$ 1.500,00', avg: 'R$ 150,00' },
    { name: 'Barba Completa', count: 12, revenue: 'R$ 540,00', avg: 'R$ 45,00' },
    { name: 'Escova Progressiva', count: 4, revenue: 'R$ 800,00', avg: 'R$ 200,00' }
  ]

  const proData = [
    { name: 'Ana Paula', count: 28, revenue: 'R$ 2.830,00' },
    { name: 'Carlos Lima', count: 22, revenue: 'R$ 1.450,00' }
  ]

  return (
    <motion.div key="reports" {...pageTransition}>
      <PageHeader title="Relatório Financeiro" subtitle="Análise de receita e performance" />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { icon: DollarSign, label: 'Receita Total', value: 'R$ 4.280', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
          { icon: Calendar, label: 'Agendamentos', value: '47', iconBg: 'bg-periwinkle-100', iconText: 'text-periwinkle-600' },
          { icon: TrendingUp, label: 'Ticket Médio', value: 'R$ 91,06', iconBg: 'bg-violet-100', iconText: 'text-violet-600' }
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-jet-black-100 p-3">
            <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center mb-2`}>
              <s.icon className={`w-4 h-4 ${s.iconText}`} />
            </div>
            <p className="text-sm md:text-base font-bold text-jet-black-900 leading-tight">{s.value}</p>
            <p className="text-[10px] text-jet-black-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue by Service */}
      <div className="bg-white rounded-xl border border-jet-black-100 p-4 mb-3">
        <h3 className="text-xs font-semibold text-jet-black-900 mb-3 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-periwinkle-600" />
          Receita por Serviço
        </h3>
        <div className="space-y-2.5">
          {serviceData.map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-jet-black-900">{s.name}</p>
                <p className="text-[10px] text-jet-black-500">{s.count} agendamentos &middot; Média: {s.avg}</p>
              </div>
              <p className="text-xs font-bold text-jet-black-900">{s.revenue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Professional */}
      <div className="bg-white rounded-xl border border-jet-black-100 p-4">
        <h3 className="text-xs font-semibold text-jet-black-900 mb-3 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-periwinkle-600" />
          Receita por Profissional
        </h3>
        <div className="space-y-2.5">
          {proData.map((p) => (
            <div key={p.name} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-jet-black-900">{p.name}</p>
                <p className="text-[10px] text-jet-black-500">{p.count} agendamentos</p>
              </div>
              <p className="text-xs font-bold text-jet-black-900">{p.revenue}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Content Router ─────────────────────────────────────────

const PAGE_COMPONENTS = {
  dashboard: DemoDashboard,
  appointments: DemoAppointments,
  reminders: DemoReminders,
  reports: DemoReports,
  clients: DemoClients,
  professionals: DemoProfessionals,
  services: DemoServices
}

// ── Main Export ─────────────────────────────────────────────

export default function InteractiveDemo() {
  const [activeNav, setActiveNav] = useState('dashboard')

  const ActivePage = PAGE_COMPONENTS[activeNav] || DemoDashboard

  return (
    <div className="flex h-[400px] md:h-[480px] lg:h-[520px] bg-gray-50 rounded-b-2xl overflow-hidden border border-t-0 border-jet-black-200 shadow-2xl">
      <DemoSidebar activeNav={activeNav} onNavClick={setActiveNav} />
      <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50">
        <AnimatePresence mode="wait">
          <ActivePage key={activeNav} />
        </AnimatePresence>
      </div>
    </div>
  )
}
