# Aplicativo PWA - Pesquisa de Satisfação PA Jetel Mendes

Um aplicativo web progressivo (PWA) completo para coleta de pesquisas de satisfação, desenvolvido em React com integração Firebase e painel administrativo.

## 🚀 Características

### Para Usuários
- ✅ Interface responsiva e intuitiva
- ✅ Formulário de pesquisa com escala de satisfação
- ✅ Funcionalidade offline (PWA)
- ✅ Instalação como app nativo
- ✅ Campos de comentários livres
- ✅ Validação de formulário

### Para Administradores
- ✅ Painel administrativo protegido
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gráficos e visualizações interativas
- ✅ Filtros por data
- ✅ Exportação de dados em CSV
- ✅ Relatórios detalhados
- ✅ Visualização de comentários

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, Tailwind CSS, Recharts
- **Backend**: Firebase (Firestore, Authentication)
- **PWA**: Service Workers, Web App Manifest
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form
- **Ícones**: Lucide React
- **Build**: Vite

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm (ou npm/yarn)
- Conta no Firebase

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd pesquisa-satisfacao-pwa/survey-app
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Configure o Firebase

#### 3.1 Criar projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome: "pesquisa-satisfacao-jetel"

#### 3.2 Configurar Authentication
1. No console do Firebase, vá para Authentication
2. Clique em "Começar"
3. Na aba "Sign-in method", habilite "Email/senha"

#### 3.3 Configurar Firestore Database
1. No console do Firebase, vá para Firestore Database
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste"
4. Escolha a localização: southamerica-east1

#### 3.4 Obter configuração do projeto
1. No console do Firebase, vá para Configurações do projeto (ícone de engrenagem)
2. Na seção "Seus aplicativos", clique em "Adicionar app" > "Web"
3. Registre o app com nome "Pesquisa Satisfação PWA"
4. Copie a configuração e substitua no arquivo `src/services/firebase.js`

#### 3.5 Configurar regras de segurança do Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to surveys for all users
    match /surveys/{document} {
      allow read, write: if true;
    }
    
    // Allow read access to admin_users only for authenticated users
    match /admin_users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### 3.6 Criar usuário administrador
1. No Authentication, adicione um usuário manualmente
2. No Firestore, crie uma coleção "admin_users"
3. Adicione um documento com o UID do usuário criado:
```javascript
{
  email: "admin@jetelmendes.com",
  role: "admin",
  created_at: "timestamp atual",
  last_login: null
}
```

### 4. Executar o projeto

#### Desenvolvimento
```bash
pnpm run dev
```

#### Build para produção
```bash
pnpm run build
```

## 📱 Funcionalidades PWA

### Instalação
- O app pode ser instalado como aplicativo nativo
- Prompt de instalação automático
- Funciona offline após primeira visita
- Ícones personalizados para diferentes dispositivos

### Service Worker
- Cache automático de recursos
- Sincronização em background
- Suporte a notificações push

## 🎯 Como Usar

### Para Usuários
1. Acesse a URL do aplicativo
2. Preencha a pesquisa de satisfação
3. Clique em "Enviar"
4. Opcionalmente, instale o app na tela inicial

### Para Administradores
1. Acesse `/admin` ou `/admin/login`
2. Faça login com credenciais de administrador
3. Visualize o dashboard com estatísticas
4. Acesse relatórios detalhados em "Relatórios"
5. Use filtros de data para análises específicas
6. Exporte dados em CSV quando necessário

## 📊 Estrutura do Banco de Dados

### Coleção: surveys
```javascript
{
  timestamp: Timestamp,
  responses: {
    atendimento_recepcao: "muito_satisfeito" | "satisfeito" | "regular" | "ruim",
    atendimento_triagem: "muito_satisfeito" | "satisfeito" | "regular" | "ruim",
    atendimento_medico: "muito_satisfeito" | "satisfeito" | "regular" | "ruim",
    capacidade_medico: "muito_satisfeito" | "satisfeito" | "regular" | "ruim",
    higienizacao: "muito_satisfeito" | "satisfeito" | "regular" | "ruim",
    atendimento_tecnicos: "muito_satisfeito" | "satisfeito" | "regular" | "ruim",
    ginastica_cloud: "string",
    espaco_colaborativo: "string", 
    visita_atendimento: "string",
    gostou_espaco: "string"
  },
  ip_address: "string",
  user_agent: "string"
}
```

### Coleção: admin_users
```javascript
{
  email: "string",
  role: "admin",
  created_at: Timestamp,
  last_login: Timestamp
}
```

## 🔒 Segurança

- Autenticação Firebase para administradores
- Rotas protegidas no frontend
- Regras de segurança no Firestore
- Validação de dados no cliente e servidor

## 📈 Métricas e Analytics

O painel administrativo fornece:
- Total de respostas
- Médias por seção
- Distribuição de satisfação
- Gráficos temporais
- Comentários recentes
- Exportação de dados

## 🚀 Deploy

### Firebase Hosting (Recomendado)
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto
firebase init hosting

# Build e deploy
pnpm run build
firebase deploy
```

### Outras opções
- Vercel
- Netlify
- GitHub Pages

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Email: suporte@jetelmendes.com
- Documentação: [Link para documentação]

## 🔄 Atualizações

### v1.0.0
- ✅ Formulário de pesquisa completo
- ✅ Painel administrativo
- ✅ Funcionalidades PWA
- ✅ Gráficos e relatórios
- ✅ Exportação de dados

---

Desenvolvido com ❤️ para PA Jetel Mendes

