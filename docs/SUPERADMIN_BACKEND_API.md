# API Backend - Super Admin Dashboard

Documentação completa dos endpoints que o backend precisa implementar para suportar o Dashboard de Super Admin.

---

## 1. Modelo de Dados

### 1.1 Adicionar role na tabela `users`

O sistema usa a autenticação existente. Basta adicionar/usar o campo `role` na tabela de usuários:

```sql
-- Se a coluna role não existir, adicionar:
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';

-- Valores possíveis: 'user', 'admin', 'superadmin'
-- Usuários com role 'admin' ou 'superadmin' podem acessar o painel

-- Definir um usuário como admin:
UPDATE users SET role = 'admin' WHERE email = 'seu@email.com';
```

**Importante:** O frontend verifica `user.role === 'admin'` ou `user.role === 'superadmin'` para permitir acesso ao dashboard.

---

## 2. Autenticação

**NÃO é necessário criar endpoints de login separados!**

O sistema usa a mesma autenticação do sistema principal (`/api/auth/login`).

O que precisa ser feito:
1. Garantir que o campo `role` seja retornado no endpoint `/api/auth/login` e `/api/auth/me`
2. Criar um decorator para verificar se o usuário é admin nos endpoints do superadmin

### 2.1 Garantir que o login retorne a role

No endpoint `/api/auth/login`, incluir o campo `role` na resposta:

```python
@auth_bp.route('/login', methods=['POST'])
def login():
    # ... código existente ...

    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role or 'user',  # <-- Adicionar isso
            'business_name': user.business_name,
            # ... outros campos
        }
    })
```

---

## 3. Decorator de Autenticação Super Admin

```python
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def superadmin_required():
    """Decorator para verificar se é um super admin autenticado"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()

            if claims.get('type') != 'superadmin':
                return jsonify({'message': 'Acesso não autorizado'}), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Uso:
@superadmin_bp.route('/companies')
@superadmin_required()
def get_companies():
    # ...
```

---

## 4. Endpoints de Empresas

### 4.1 GET `/api/superadmin/companies`

**Descrição:** Lista todas as empresas cadastradas com paginação e filtros

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| page | int | Página atual (default: 1) |
| per_page | int | Itens por página (default: 10, max: 100) |
| search | string | Busca por nome, email ou slug |
| status | string | Filtro por status: active, trialing, past_due, canceled, suspended |
| plan | string | Filtro por plano: basic, pro, enterprise |
| sort_by | string | Campo para ordenar: created_at, business_name, mrr |
| order | string | Direção: asc, desc |

**Response (200 OK):**
```json
{
    "companies": [
        {
            "id": 1,
            "business_name": "Salão da Maria",
            "slug": "salao-da-maria",
            "owner_name": "Maria Silva",
            "owner_email": "maria@email.com",
            "business_phone": "(11) 99999-9999",
            "subscription": {
                "id": 1,
                "plan": "pro",
                "status": "active",
                "start_date": "2024-01-01T00:00:00Z",
                "end_date": "2024-02-01T00:00:00Z",
                "trial_end": null
            },
            "mrr": 59.00,
            "stats": {
                "total_clients": 150,
                "total_appointments": 500,
                "total_revenue": 15000.00
            },
            "created_at": "2024-01-01T10:00:00Z",
            "last_activity": "2024-01-15T14:30:00Z"
        }
    ],
    "pagination": {
        "page": 1,
        "pages": 10,
        "total": 100,
        "per_page": 10
    }
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/companies', methods=['GET'])
@superadmin_required()
def get_companies():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    search = request.args.get('search', '')
    status = request.args.get('status', '')
    plan = request.args.get('plan', '')
    sort_by = request.args.get('sort_by', 'created_at')
    order = request.args.get('order', 'desc')

    # Query base - users são os "donos" das empresas
    query = User.query

    # Aplicar busca
    if search:
        search_filter = f'%{search}%'
        query = query.filter(
            db.or_(
                User.business_name.ilike(search_filter),
                User.email.ilike(search_filter),
                User.slug.ilike(search_filter),
                User.name.ilike(search_filter)
            )
        )

    # Filtrar por status da assinatura
    if status:
        query = query.join(Subscription).filter(Subscription.status == status)

    # Filtrar por plano
    if plan:
        query = query.join(Subscription).filter(Subscription.plan == plan)

    # Ordenação
    if sort_by == 'business_name':
        order_col = User.business_name
    elif sort_by == 'mrr':
        # Ordenar por MRR requer join com tabela de preços
        order_col = User.created_at  # Simplificado
    else:
        order_col = User.created_at

    if order == 'asc':
        query = query.order_by(order_col.asc())
    else:
        query = query.order_by(order_col.desc())

    # Paginação
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    companies = []
    for user in pagination.items:
        subscription = Subscription.query.filter_by(user_id=user.id).first()

        # Calcular estatísticas
        total_clients = Client.query.filter_by(user_id=user.id).count()
        total_appointments = Appointment.query.filter_by(user_id=user.id).count()
        total_revenue = db.session.query(db.func.sum(Appointment.price)).filter(
            Appointment.user_id == user.id,
            Appointment.status == 'completed'
        ).scalar() or 0

        # Calcular MRR baseado no plano
        mrr = get_plan_price(subscription.plan) if subscription else 0

        companies.append({
            'id': user.id,
            'business_name': user.business_name,
            'slug': user.slug,
            'owner_name': user.name,
            'owner_email': user.email,
            'business_phone': user.business_phone,
            'subscription': {
                'id': subscription.id if subscription else None,
                'plan': subscription.plan if subscription else None,
                'status': subscription.status if subscription else None,
                'start_date': subscription.start_date.isoformat() if subscription and subscription.start_date else None,
                'end_date': subscription.end_date.isoformat() if subscription and subscription.end_date else None,
                'trial_end': subscription.trial_end.isoformat() if subscription and subscription.trial_end else None
            } if subscription else None,
            'mrr': mrr,
            'stats': {
                'total_clients': total_clients,
                'total_appointments': total_appointments,
                'total_revenue': float(total_revenue)
            },
            'created_at': user.created_at.isoformat(),
            'last_activity': get_last_activity(user.id)
        })

    return jsonify({
        'companies': companies,
        'pagination': {
            'page': pagination.page,
            'pages': pagination.pages,
            'total': pagination.total,
            'per_page': per_page
        }
    })

def get_plan_price(plan):
    """Retorna o preço mensal do plano"""
    prices = {
        'basic': 29.00,
        'pro': 59.00,
        'enterprise': 99.00
    }
    return prices.get(plan, 0)

def get_last_activity(user_id):
    """Retorna a data da última atividade da empresa"""
    last_appointment = Appointment.query.filter_by(user_id=user_id)\
        .order_by(Appointment.created_at.desc()).first()
    if last_appointment:
        return last_appointment.created_at.isoformat()
    return None
```

### 4.2 GET `/api/superadmin/companies/{id}`

**Descrição:** Retorna detalhes completos de uma empresa

**Response (200 OK):**
```json
{
    "id": 1,
    "business_name": "Salão da Maria",
    "slug": "salao-da-maria",
    "owner_name": "Maria Silva",
    "owner_email": "maria@email.com",
    "business_phone": "(11) 99999-9999",
    "business_address": "Rua das Flores, 123",
    "online_booking_enabled": true,
    "subscription": {
        "id": 1,
        "plan": "pro",
        "status": "active",
        "start_date": "2024-01-01T00:00:00Z",
        "end_date": "2024-02-01T00:00:00Z",
        "trial_end": null,
        "stripe_subscription_id": "sub_xxx",
        "cancel_at_period_end": false
    },
    "mrr": 59.00,
    "stats": {
        "total_clients": 150,
        "total_professionals": 5,
        "total_services": 20,
        "total_appointments": 500,
        "total_revenue": 15000.00,
        "appointments_this_month": 45,
        "revenue_this_month": 2500.00
    },
    "subscription_history": [
        {
            "type": "created",
            "description": "Assinatura criada - Plano Pro",
            "date": "2024-01-01T10:00:00Z"
        },
        {
            "type": "upgraded",
            "description": "Upgrade de Basic para Pro",
            "date": "2024-01-15T14:30:00Z"
        }
    ],
    "created_at": "2024-01-01T10:00:00Z"
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/companies/<int:id>', methods=['GET'])
@superadmin_required()
def get_company(id):
    user = User.query.get_or_404(id)
    subscription = Subscription.query.filter_by(user_id=user.id).first()

    # Estatísticas
    total_clients = Client.query.filter_by(user_id=user.id).count()
    total_professionals = Professional.query.filter_by(user_id=user.id).count()
    total_services = Service.query.filter_by(user_id=user.id).count()
    total_appointments = Appointment.query.filter_by(user_id=user.id).count()

    total_revenue = db.session.query(db.func.sum(Appointment.price)).filter(
        Appointment.user_id == user.id,
        Appointment.status == 'completed'
    ).scalar() or 0

    # Este mês
    first_day_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    appointments_this_month = Appointment.query.filter(
        Appointment.user_id == user.id,
        Appointment.created_at >= first_day_of_month
    ).count()

    revenue_this_month = db.session.query(db.func.sum(Appointment.price)).filter(
        Appointment.user_id == user.id,
        Appointment.status == 'completed',
        Appointment.created_at >= first_day_of_month
    ).scalar() or 0

    # Histórico de assinatura (você pode criar uma tabela subscription_events)
    subscription_history = get_subscription_history(user.id)

    return jsonify({
        'id': user.id,
        'business_name': user.business_name,
        'slug': user.slug,
        'owner_name': user.name,
        'owner_email': user.email,
        'business_phone': user.business_phone,
        'business_address': user.business_address,
        'online_booking_enabled': user.online_booking_enabled,
        'subscription': {
            'id': subscription.id,
            'plan': subscription.plan,
            'status': subscription.status,
            'start_date': subscription.start_date.isoformat() if subscription.start_date else None,
            'end_date': subscription.end_date.isoformat() if subscription.end_date else None,
            'trial_end': subscription.trial_end.isoformat() if subscription.trial_end else None,
            'stripe_subscription_id': subscription.stripe_subscription_id,
            'cancel_at_period_end': subscription.cancel_at_period_end
        } if subscription else None,
        'mrr': get_plan_price(subscription.plan) if subscription else 0,
        'stats': {
            'total_clients': total_clients,
            'total_professionals': total_professionals,
            'total_services': total_services,
            'total_appointments': total_appointments,
            'total_revenue': float(total_revenue),
            'appointments_this_month': appointments_this_month,
            'revenue_this_month': float(revenue_this_month)
        },
        'subscription_history': subscription_history,
        'created_at': user.created_at.isoformat()
    })
```

### 4.3 POST `/api/superadmin/companies/{id}/suspend`

**Descrição:** Suspende uma empresa

**Request Body:**
```json
{
    "reason": "Violação dos termos de uso"
}
```

**Response (200 OK):**
```json
{
    "message": "Empresa suspensa com sucesso",
    "status": "suspended"
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/companies/<int:id>/suspend', methods=['POST'])
@superadmin_required()
def suspend_company(id):
    data = request.get_json()
    reason = data.get('reason', 'Suspensa pelo administrador')

    user = User.query.get_or_404(id)
    subscription = Subscription.query.filter_by(user_id=user.id).first()

    if subscription:
        subscription.status = 'suspended'
        subscription.suspended_reason = reason
        subscription.suspended_at = datetime.utcnow()
        db.session.commit()

    # Log da ação
    log_admin_action('suspend_company', id, reason)

    return jsonify({
        'message': 'Empresa suspensa com sucesso',
        'status': 'suspended'
    })
```

### 4.4 POST `/api/superadmin/companies/{id}/activate`

**Descrição:** Reativa uma empresa suspensa

**Response (200 OK):**
```json
{
    "message": "Empresa ativada com sucesso",
    "status": "active"
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/companies/<int:id>/activate', methods=['POST'])
@superadmin_required()
def activate_company(id):
    user = User.query.get_or_404(id)
    subscription = Subscription.query.filter_by(user_id=user.id).first()

    if subscription:
        subscription.status = 'active'
        subscription.suspended_reason = None
        subscription.suspended_at = None
        db.session.commit()

    log_admin_action('activate_company', id)

    return jsonify({
        'message': 'Empresa ativada com sucesso',
        'status': 'active'
    })
```

---

## 5. Endpoints de Assinaturas

### 5.1 GET `/api/superadmin/subscriptions`

**Descrição:** Lista todas as assinaturas

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| page | int | Página atual |
| per_page | int | Itens por página |
| search | string | Busca por nome da empresa |
| status | string | active, trialing, past_due, canceled |
| plan | string | basic, pro, enterprise |
| expiring_soon | bool | Se true, retorna apenas vencendo em 7 dias |

**Response (200 OK):**
```json
{
    "subscriptions": [
        {
            "id": 1,
            "company_id": 1,
            "company_name": "Salão da Maria",
            "company_email": "maria@email.com",
            "plan": "pro",
            "status": "active",
            "mrr": 59.00,
            "start_date": "2024-01-01T00:00:00Z",
            "end_date": "2024-02-01T00:00:00Z",
            "trial_end": null,
            "cancel_at_period_end": false
        }
    ],
    "pagination": {
        "page": 1,
        "pages": 5,
        "total": 50,
        "per_page": 10
    },
    "stats": {
        "active": 40,
        "trialing": 5,
        "past_due": 3,
        "canceled": 2
    }
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/subscriptions', methods=['GET'])
@superadmin_required()
def get_subscriptions():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')
    status = request.args.get('status', '')
    plan = request.args.get('plan', '')
    expiring_soon = request.args.get('expiring_soon', type=bool)

    query = Subscription.query.join(User)

    if search:
        search_filter = f'%{search}%'
        query = query.filter(
            db.or_(
                User.business_name.ilike(search_filter),
                User.email.ilike(search_filter)
            )
        )

    if status:
        query = query.filter(Subscription.status == status)

    if plan:
        query = query.filter(Subscription.plan == plan)

    if expiring_soon:
        seven_days_from_now = datetime.utcnow() + timedelta(days=7)
        query = query.filter(
            Subscription.end_date <= seven_days_from_now,
            Subscription.end_date >= datetime.utcnow(),
            Subscription.status == 'active'
        )

    # Estatísticas
    stats = {
        'active': Subscription.query.filter_by(status='active').count(),
        'trialing': Subscription.query.filter_by(status='trialing').count(),
        'past_due': Subscription.query.filter_by(status='past_due').count(),
        'canceled': Subscription.query.filter_by(status='canceled').count()
    }

    pagination = query.order_by(Subscription.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    subscriptions = []
    for sub in pagination.items:
        user = User.query.get(sub.user_id)
        subscriptions.append({
            'id': sub.id,
            'company_id': user.id,
            'company_name': user.business_name,
            'company_email': user.email,
            'plan': sub.plan,
            'status': sub.status,
            'mrr': get_plan_price(sub.plan),
            'start_date': sub.start_date.isoformat() if sub.start_date else None,
            'end_date': sub.end_date.isoformat() if sub.end_date else None,
            'trial_end': sub.trial_end.isoformat() if sub.trial_end else None,
            'cancel_at_period_end': sub.cancel_at_period_end
        })

    return jsonify({
        'subscriptions': subscriptions,
        'pagination': {
            'page': pagination.page,
            'pages': pagination.pages,
            'total': pagination.total,
            'per_page': per_page
        },
        'stats': stats
    })
```

### 5.2 PUT `/api/superadmin/subscriptions/{id}/plan`

**Descrição:** Altera o plano de uma assinatura manualmente

**Request Body:**
```json
{
    "new_plan": "enterprise"
}
```

**Response (200 OK):**
```json
{
    "message": "Plano alterado com sucesso",
    "plan": "enterprise",
    "mrr": 99.00
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/subscriptions/<int:id>/plan', methods=['PUT'])
@superadmin_required()
def change_subscription_plan(id):
    data = request.get_json()
    new_plan = data.get('new_plan')

    if new_plan not in ['basic', 'pro', 'enterprise']:
        return jsonify({'message': 'Plano inválido'}), 400

    subscription = Subscription.query.get_or_404(id)
    old_plan = subscription.plan
    subscription.plan = new_plan
    db.session.commit()

    # Log da alteração
    log_admin_action('change_plan', subscription.user_id, f'{old_plan} -> {new_plan}')

    return jsonify({
        'message': 'Plano alterado com sucesso',
        'plan': new_plan,
        'mrr': get_plan_price(new_plan)
    })
```

### 5.3 POST `/api/superadmin/subscriptions/{id}/extend`

**Descrição:** Estende o período de uma assinatura

**Request Body:**
```json
{
    "days": 30
}
```

**Response (200 OK):**
```json
{
    "message": "Assinatura estendida por 30 dias",
    "new_end_date": "2024-03-01T00:00:00Z"
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/subscriptions/<int:id>/extend', methods=['POST'])
@superadmin_required()
def extend_subscription(id):
    data = request.get_json()
    days = data.get('days', 30)

    if days < 1 or days > 365:
        return jsonify({'message': 'Dias deve ser entre 1 e 365'}), 400

    subscription = Subscription.query.get_or_404(id)

    # Se já tem end_date, estende a partir dela, senão a partir de hoje
    if subscription.end_date:
        new_end = subscription.end_date + timedelta(days=days)
    else:
        new_end = datetime.utcnow() + timedelta(days=days)

    subscription.end_date = new_end
    db.session.commit()

    log_admin_action('extend_subscription', subscription.user_id, f'+{days} dias')

    return jsonify({
        'message': f'Assinatura estendida por {days} dias',
        'new_end_date': new_end.isoformat()
    })
```

### 5.4 GET `/api/superadmin/subscriptions/expiring`

**Descrição:** Lista assinaturas que estão vencendo em breve

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| days | int | Dias para considerar (default: 7) |

**Response (200 OK):**
```json
{
    "subscriptions": [
        {
            "id": 1,
            "company_id": 1,
            "company_name": "Salão da Maria",
            "plan": "pro",
            "end_date": "2024-01-20T00:00:00Z",
            "days_remaining": 5
        }
    ],
    "total": 3
}
```

---

## 6. Endpoints de Analytics

### 6.1 GET `/api/superadmin/analytics/overview`

**Descrição:** Retorna métricas gerais da plataforma

**Response (200 OK):**
```json
{
    "total_companies": 100,
    "active_companies": 85,
    "trial_companies": 10,
    "past_due_companies": 3,
    "canceled_this_month": 2,
    "new_companies_month": 15,
    "total_mrr": 5000.00,
    "mrr_growth": 12.5,
    "churn_rate": 2.3,
    "growth_rate": 15.0,
    "arpu": 58.82,
    "ltv": 1500.00,
    "total_revenue": 50000.00,
    "trial_conversion_rate": 65.0,
    "avg_lifetime_months": 25
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/analytics/overview', methods=['GET'])
@superadmin_required()
def get_analytics_overview():
    # Total de empresas
    total_companies = User.query.count()

    # Empresas por status
    active_companies = Subscription.query.filter_by(status='active').count()
    trial_companies = Subscription.query.filter_by(status='trialing').count()
    past_due_companies = Subscription.query.filter_by(status='past_due').count()

    # Este mês
    first_day_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    new_companies_month = User.query.filter(
        User.created_at >= first_day_of_month
    ).count()

    canceled_this_month = Subscription.query.filter(
        Subscription.status == 'canceled',
        Subscription.updated_at >= first_day_of_month
    ).count()

    # MRR - soma dos preços mensais de assinaturas ativas
    mrr = 0
    for sub in Subscription.query.filter(Subscription.status.in_(['active', 'trialing'])):
        mrr += get_plan_price(sub.plan)

    # MRR do mês anterior para calcular crescimento
    last_month = first_day_of_month - timedelta(days=1)
    first_day_last_month = last_month.replace(day=1)
    # (simplificado - idealmente você teria histórico de MRR)
    mrr_growth = 12.5  # Placeholder

    # Churn rate = cancelados / (ativos no início do período) * 100
    churn_rate = (canceled_this_month / max(active_companies, 1)) * 100 if active_companies > 0 else 0

    # Growth rate = (novos - cancelados) / total * 100
    growth_rate = ((new_companies_month - canceled_this_month) / max(total_companies, 1)) * 100

    # ARPU (Average Revenue Per User)
    arpu = mrr / max(active_companies, 1) if active_companies > 0 else 0

    # LTV simplificado (ARPU * tempo médio de vida)
    avg_lifetime_months = 25  # Placeholder - calcular baseado em dados reais
    ltv = arpu * avg_lifetime_months

    # Receita total
    total_revenue = db.session.query(db.func.sum(Appointment.price)).filter(
        Appointment.status == 'completed'
    ).scalar() or 0

    # Taxa de conversão de trial
    converted_trials = Subscription.query.filter(
        Subscription.status == 'active',
        Subscription.trial_end.isnot(None)
    ).count()
    total_trials = trial_companies + converted_trials
    trial_conversion_rate = (converted_trials / max(total_trials, 1)) * 100 if total_trials > 0 else 0

    return jsonify({
        'total_companies': total_companies,
        'active_companies': active_companies,
        'trial_companies': trial_companies,
        'past_due_companies': past_due_companies,
        'canceled_this_month': canceled_this_month,
        'new_companies_month': new_companies_month,
        'total_mrr': round(mrr, 2),
        'mrr_growth': round(mrr_growth, 1),
        'churn_rate': round(churn_rate, 1),
        'growth_rate': round(growth_rate, 1),
        'arpu': round(arpu, 2),
        'ltv': round(ltv, 2),
        'total_revenue': float(total_revenue),
        'trial_conversion_rate': round(trial_conversion_rate, 1),
        'avg_lifetime_months': avg_lifetime_months
    })
```

### 6.2 GET `/api/superadmin/analytics/revenue`

**Descrição:** Retorna dados de receita ao longo do tempo

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| period | string | daily, weekly, monthly (default: monthly) |
| start_date | string | Data inicial (ISO format) |
| end_date | string | Data final (ISO format) |

**Response (200 OK):**
```json
{
    "data": [
        {
            "date": "2024-01",
            "label": "Janeiro 2024",
            "revenue": 5000.00,
            "new_subscriptions": 10,
            "cancellations": 2
        },
        {
            "date": "2024-02",
            "label": "Fevereiro 2024",
            "revenue": 5500.00,
            "new_subscriptions": 12,
            "cancellations": 1
        }
    ]
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/analytics/revenue', methods=['GET'])
@superadmin_required()
def get_revenue_analytics():
    period = request.args.get('period', 'monthly')

    # Últimos 12 meses
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=365)

    data = []

    if period == 'monthly':
        current = start_date.replace(day=1)
        while current <= end_date:
            next_month = (current + timedelta(days=32)).replace(day=1)

            # Calcular MRR do mês
            mrr = 0
            subs = Subscription.query.filter(
                Subscription.start_date <= next_month,
                db.or_(
                    Subscription.end_date >= current,
                    Subscription.end_date.is_(None)
                ),
                Subscription.status.in_(['active', 'trialing'])
            ).all()

            for sub in subs:
                mrr += get_plan_price(sub.plan)

            # Novas assinaturas
            new_subs = Subscription.query.filter(
                Subscription.start_date >= current,
                Subscription.start_date < next_month
            ).count()

            # Cancelamentos
            cancellations = Subscription.query.filter(
                Subscription.status == 'canceled',
                Subscription.updated_at >= current,
                Subscription.updated_at < next_month
            ).count()

            data.append({
                'date': current.strftime('%Y-%m'),
                'label': current.strftime('%B %Y'),
                'revenue': round(mrr, 2),
                'new_subscriptions': new_subs,
                'cancellations': cancellations
            })

            current = next_month

    return jsonify({'data': data})
```

### 6.3 GET `/api/superadmin/analytics/growth`

**Descrição:** Retorna dados de crescimento de empresas

**Response (200 OK):**
```json
{
    "data": [
        {
            "date": "2024-01",
            "label": "Janeiro 2024",
            "new_companies": 15,
            "churned_companies": 2,
            "net_growth": 13
        }
    ]
}
```

### 6.4 GET `/api/superadmin/analytics/plans`

**Descrição:** Retorna distribuição por plano

**Response (200 OK):**
```json
{
    "plans": [
        {
            "plan": "basic",
            "count": 30,
            "percentage": 35.3,
            "revenue": 870.00
        },
        {
            "plan": "pro",
            "count": 45,
            "percentage": 52.9,
            "revenue": 2655.00
        },
        {
            "plan": "enterprise",
            "count": 10,
            "percentage": 11.8,
            "revenue": 990.00
        }
    ]
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/analytics/plans', methods=['GET'])
@superadmin_required()
def get_plan_distribution():
    plans_data = []
    total = Subscription.query.filter(
        Subscription.status.in_(['active', 'trialing'])
    ).count()

    for plan in ['basic', 'pro', 'enterprise']:
        count = Subscription.query.filter(
            Subscription.plan == plan,
            Subscription.status.in_(['active', 'trialing'])
        ).count()

        percentage = (count / max(total, 1)) * 100 if total > 0 else 0
        revenue = count * get_plan_price(plan)

        plans_data.append({
            'plan': plan,
            'count': count,
            'percentage': round(percentage, 1),
            'revenue': round(revenue, 2)
        })

    return jsonify({'plans': plans_data})
```

---

## 7. Endpoints de Alertas

### 7.1 GET `/api/superadmin/alerts`

**Descrição:** Retorna alertas do sistema

**Response (200 OK):**
```json
{
    "alerts": [
        {
            "type": "warning",
            "message": "5 assinaturas vencendo em 7 dias",
            "count": 5
        },
        {
            "type": "critical",
            "message": "3 pagamentos atrasados",
            "count": 3
        },
        {
            "type": "info",
            "message": "10 empresas em período de trial",
            "count": 10
        }
    ]
}
```

**Implementação Flask:**
```python
@superadmin_bp.route('/alerts', methods=['GET'])
@superadmin_required()
def get_alerts():
    alerts = []

    # Assinaturas vencendo em 7 dias
    seven_days = datetime.utcnow() + timedelta(days=7)
    expiring = Subscription.query.filter(
        Subscription.end_date <= seven_days,
        Subscription.end_date >= datetime.utcnow(),
        Subscription.status == 'active'
    ).count()

    if expiring > 0:
        alerts.append({
            'type': 'warning',
            'message': f'{expiring} assinatura(s) vencendo em 7 dias',
            'count': expiring
        })

    # Pagamentos atrasados
    past_due = Subscription.query.filter_by(status='past_due').count()
    if past_due > 0:
        alerts.append({
            'type': 'critical',
            'message': f'{past_due} pagamento(s) atrasado(s)',
            'count': past_due
        })

    # Trials expirando
    trial_expiring = Subscription.query.filter(
        Subscription.status == 'trialing',
        Subscription.trial_end <= seven_days,
        Subscription.trial_end >= datetime.utcnow()
    ).count()

    if trial_expiring > 0:
        alerts.append({
            'type': 'info',
            'message': f'{trial_expiring} trial(s) expirando em 7 dias',
            'count': trial_expiring
        })

    return jsonify({'alerts': alerts})
```

---

## 8. Registro de Ações (Audit Log)

### 8.1 Tabela `admin_audit_log`

```sql
CREATE TABLE admin_audit_log (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES superadmin_users(id),
    action VARCHAR(100) NOT NULL,
    target_id INTEGER,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8.2 Função de Log

```python
def log_admin_action(action, target_id=None, details=None):
    """Registra uma ação administrativa"""
    claims = get_jwt()
    admin_id = claims.get('superadmin_id')

    log = AdminAuditLog(
        admin_id=admin_id,
        action=action,
        target_id=target_id,
        details=details,
        ip_address=request.remote_addr
    )
    db.session.add(log)
    db.session.commit()
```

---

## 9. Estrutura de Blueprints

```python
# app.py ou __init__.py

from flask import Flask
from routes.superadmin import superadmin_bp

app = Flask(__name__)

# Registrar blueprint
app.register_blueprint(superadmin_bp)
```

```
backend/
├── routes/
│   ├── __init__.py
│   ├── auth.py
│   ├── clients.py
│   ├── appointments.py
│   └── superadmin.py          # Novo arquivo
├── models/
│   ├── __init__.py
│   ├── user.py
│   ├── subscription.py
│   └── superadmin.py          # Novo arquivo (opcional)
└── utils/
    ├── __init__.py
    └── admin_helpers.py       # Funções auxiliares
```

---

## 10. Resumo dos Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/superadmin/login` | Login do super admin |
| GET | `/api/superadmin/me` | Dados do admin logado |
| GET | `/api/superadmin/companies` | Listar empresas |
| GET | `/api/superadmin/companies/{id}` | Detalhes da empresa |
| POST | `/api/superadmin/companies/{id}/suspend` | Suspender empresa |
| POST | `/api/superadmin/companies/{id}/activate` | Ativar empresa |
| GET | `/api/superadmin/subscriptions` | Listar assinaturas |
| PUT | `/api/superadmin/subscriptions/{id}/plan` | Alterar plano |
| POST | `/api/superadmin/subscriptions/{id}/extend` | Estender período |
| GET | `/api/superadmin/subscriptions/expiring` | Assinaturas vencendo |
| GET | `/api/superadmin/analytics/overview` | Métricas gerais |
| GET | `/api/superadmin/analytics/revenue` | Dados de receita |
| GET | `/api/superadmin/analytics/growth` | Dados de crescimento |
| GET | `/api/superadmin/analytics/plans` | Distribuição por plano |
| GET | `/api/superadmin/alerts` | Alertas do sistema |

---

## 11. Segurança

### 11.1 Checklist de Segurança

- [ ] Usar HTTPS em produção
- [ ] Tokens JWT com expiração curta (1h recomendado)
- [ ] Rate limiting nos endpoints de login
- [ ] Validar todos os inputs
- [ ] Sanitizar dados antes de salvar
- [ ] Registrar todas as ações em audit log
- [ ] Usar prepared statements para queries
- [ ] Não expor informações sensíveis em erros

### 11.2 Headers de Segurança

```python
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response
```

---

## 12. Testes

### 12.1 Teste de Login

```python
def test_superadmin_login():
    response = client.post('/api/superadmin/login', json={
        'email': 'admin@agendamais.com',
        'password': 'senha123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json
```

### 12.2 Teste de Acesso Não Autorizado

```python
def test_unauthorized_access():
    response = client.get('/api/superadmin/companies')
    assert response.status_code == 401
```

---

Esta documentação cobre todos os endpoints necessários para o Dashboard de Super Admin funcionar completamente.
