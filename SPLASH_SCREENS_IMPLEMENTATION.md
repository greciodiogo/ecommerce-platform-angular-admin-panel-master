# Implementação do Módulo de Splash Screens

## 📋 Resumo

Sistema completo de gestão de splash screens para o aplicativo móvel, permitindo que administradores criem, editem, reordenem e gerenciem as telas de splash exibidas no app.

## 🎯 Funcionalidades Implementadas

### Backend (NestJS)
- ✅ CRUD completo de splash screens
- ✅ Endpoint público para app móvel (`/splash-screens/active`)
- ✅ Reordenação de splash screens
- ✅ Validações de dados
- ✅ Autenticação e autorização (apenas Admin)
- ✅ Documentação Swagger

### Frontend (Angular)
- ✅ Listagem com drag-and-drop para reordenar
- ✅ Formulário de criação/edição
- ✅ Preview de imagens
- ✅ Ativar/desativar splash screens
- ✅ Exclusão com confirmação
- ✅ Validações de formulário
- ✅ Design responsivo com Material Design

## 📁 Arquivos Criados

### Backend
```
ecommerce-platform-nestjs-api-master/src/splash-screens/
├── dto/
│   ├── splash-screen-create.dto.ts
│   └── splash-screen-update.dto.ts
├── models/
│   └── splash-screen.entity.ts
├── splash-screens.controller.ts
├── splash-screens.service.ts
├── splash-screens.module.ts
├── splash-screens.migration.sql
└── README.md
```

### Frontend
```
ecommerce-platform-angular-admin-panel-master/src/app/splash-screens/
├── splash-screens/
│   ├── splash-screens.component.ts
│   ├── splash-screens.component.html
│   └── splash-screens.component.scss
├── splash-screens-list/
│   ├── splash-screens-list.component.ts
│   ├── splash-screens-list.component.html
│   └── splash-screens-list.component.scss
├── splash-screen-form/
│   ├── splash-screen-form.component.ts
│   ├── splash-screen-form.component.html
│   └── splash-screen-form.component.scss
├── splash-screens.service.ts
├── splash-screens.module.ts
└── splash-screens-routing.module.ts
```

## 🔧 Arquivos Modificados

### Backend
- `src/app.module.ts` - Registrado SplashScreensModule

### Frontend
- `src/app/app-routing.module.ts` - Adicionada rota lazy-loaded
- `src/app/components/sidenav/sidenav.component.html` - Adicionado item no menu

## 🗄️ Estrutura do Banco de Dados

```sql
CREATE TABLE public.splash_screens (
    id serial PRIMARY KEY,
    title varchar(255) NOT NULL,
    description text,
    image_url varchar(500) NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    duration integer DEFAULT 3000 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Como Usar

### 1. Configurar o Banco de Dados

Execute o script SQL:
```bash
cd ecommerce-platform-nestjs-api-master/src/splash-screens
psql -U seu_usuario -d seu_banco -f splash-screens.migration.sql
```

### 2. Iniciar o Backend

```bash
cd ecommerce-platform-nestjs-api-master
npm install
npm run start:dev
```

### 3. Iniciar o Frontend

```bash
cd ecommerce-platform-angular-admin-panel-master
npm install
npm start
```

### 4. Acessar o Painel

1. Faça login como Admin
2. No menu lateral, vá em **Settings > Splash Screens**
3. Crie, edite e gerencie os splash screens

## 📱 Integração com App Móvel

O app móvel deve consumir o endpoint público:

```typescript
GET https://seu-api.com/splash-screens/active

// Resposta:
[
  {
    id: 1,
    title: "Bem-vindo",
    description: "Bem-vindo ao nosso app",
    imageUrl: "https://...",
    order: 0,
    duration: 3000,
    isActive: true
  }
]
```

### Exemplo de Uso no App Móvel

```typescript
// Buscar splash screens ativos
const splashScreens = await fetch('https://api.com/splash-screens/active')
  .then(res => res.json());

// Exibir cada splash screen pela duração especificada
for (const screen of splashScreens) {
  showSplashScreen(screen.imageUrl);
  await sleep(screen.duration);
}
```

## 🔐 Permissões

- **Admin**: Acesso completo (criar, editar, excluir, reordenar)
- **Público**: Apenas visualizar splash screens ativos

## 🎨 Recursos de UI

- **Drag & Drop**: Reordene splash screens arrastando
- **Preview**: Visualize a imagem antes de salvar
- **Toggle Rápido**: Ative/desative com um clique
- **Validações**: Feedback em tempo real no formulário
- **Responsivo**: Funciona em desktop, tablet e mobile

## 📊 Campos do Formulário

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| Título | Texto | Sim | Nome do splash screen (máx. 255 chars) |
| Descrição | Texto longo | Não | Descrição opcional |
| URL da Imagem | URL | Sim | Link da imagem (máx. 500 chars) |
| Ordem | Número | Sim | Ordem de exibição (0, 1, 2...) |
| Duração | Número | Sim | Tempo em ms (mín. 1000ms) |
| Ativo | Toggle | Sim | Se está ativo (padrão: true) |

## 🧪 Testes

Para testar a API:

```bash
# Listar todos (Admin)
curl -X GET http://localhost:3000/splash-screens \
  -H "Cookie: admin.sid=..."

# Listar ativos (Público)
curl -X GET http://localhost:3000/splash-screens/active

# Criar novo (Admin)
curl -X POST http://localhost:3000/splash-screens \
  -H "Content-Type: application/json" \
  -H "Cookie: admin.sid=..." \
  -d '{
    "title": "Bem-vindo",
    "imageUrl": "https://example.com/image.jpg",
    "duration": 3000,
    "order": 0
  }'
```

## 📝 Notas Importantes

1. As imagens devem estar hospedadas externamente (CDN, S3, etc.)
2. A ordem é automática ao usar drag-and-drop
3. Apenas splash screens ativos são retornados no endpoint público
4. A duração mínima é 1 segundo (1000ms)
5. O módulo segue os padrões do projeto existente

## 🐛 Troubleshooting

### Erro ao carregar splash screens
- Verifique se a tabela foi criada no banco
- Confirme que o módulo está registrado no app.module.ts

### Imagens não aparecem
- Verifique se a URL da imagem é válida e acessível
- Confirme que não há bloqueio de CORS

### Não consigo acessar o menu
- Verifique se está logado como Admin
- Limpe o cache do navegador

## 🎉 Pronto!

O sistema de gestão de splash screens está completo e pronto para uso!
