# Instruções para VS Code

## Extensões Recomendadas

Para uma melhor experiência de desenvolvimento, instale as seguintes extensões no VS Code:

### Essenciais
- **ES7+ React/Redux/React-Native snippets** - Snippets para React
- **Tailwind CSS IntelliSense** - Autocomplete para Tailwind
- **Firebase** - Suporte para Firebase
- **Prettier - Code formatter** - Formatação automática
- **ESLint** - Linting para JavaScript/React

### Opcionais
- **Auto Rename Tag** - Renomeia tags HTML automaticamente
- **Bracket Pair Colorizer** - Coloriza parênteses
- **GitLens** - Melhor integração com Git
- **Thunder Client** - Cliente REST para testar APIs

## Configuração do Workspace

Crie um arquivo `.vscode/settings.json` na raiz do projeto:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Snippets Úteis

### Componente React Funcional
```javascript
// Digite: rafce
import React from 'react'

const ComponentName = () => {
  return (
    <div>ComponentName</div>
  )
}

export default ComponentName
```

### Hook useState
```javascript
// Digite: useState
const [state, setState] = useState(initialState)
```

### Hook useEffect
```javascript
// Digite: useEffect
useEffect(() => {
  
}, [])
```

## Estrutura de Pastas no VS Code

```
survey-app/
├── public/
│   ├── icons/           # Ícones PWA
│   ├── manifest.json    # Manifest PWA
│   └── sw.js           # Service Worker
├── src/
│   ├── components/
│   │   ├── Admin/      # Componentes administrativos
│   │   ├── Auth/       # Componentes de autenticação
│   │   ├── Common/     # Componentes reutilizáveis
│   │   ├── Survey/     # Componentes da pesquisa
│   │   └── ui/         # Componentes UI (shadcn)
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços (Firebase, API)
│   ├── utils/          # Utilitários
│   ├── App.jsx         # Componente principal
│   ├── App.css         # Estilos principais
│   └── main.jsx        # Ponto de entrada
├── README.md
├── package.json
└── vite.config.js
```

## Comandos Úteis no Terminal Integrado

### Desenvolvimento
```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Preview do build
pnpm run preview
```

### Firebase
```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto Firebase
firebase init

# Deploy para Firebase Hosting
firebase deploy
```

### Git
```bash
# Inicializar repositório
git init

# Adicionar arquivos
git add .

# Commit
git commit -m "Initial commit"

# Adicionar remote
git remote add origin <url-do-repositorio>

# Push
git push -u origin main
```

## Debugging

### React Developer Tools
1. Instale a extensão React Developer Tools no navegador
2. Abra as ferramentas de desenvolvedor (F12)
3. Use as abas "Components" e "Profiler"

### Firebase Debugging
1. Use o Firebase Console para monitorar dados
2. Verifique as regras de segurança do Firestore
3. Use o emulador do Firebase para desenvolvimento local

### PWA Debugging
1. Abra as ferramentas de desenvolvedor
2. Vá para a aba "Application"
3. Verifique Service Workers, Manifest, e Storage

## Atalhos Úteis

- **Ctrl+Shift+P**: Command Palette
- **Ctrl+`**: Terminal integrado
- **Ctrl+Shift+E**: Explorer
- **Ctrl+Shift+F**: Busca global
- **Ctrl+D**: Selecionar próxima ocorrência
- **Alt+Shift+F**: Formatar documento
- **Ctrl+/**: Comentar/descomentar linha

## Troubleshooting

### Problemas Comuns

1. **Erro de importação de módulos**
   - Verifique se o caminho está correto
   - Use aliases configurados (@/components)

2. **Tailwind não funciona**
   - Verifique se o arquivo está importado no index.css
   - Reinicie o servidor de desenvolvimento

3. **Firebase não conecta**
   - Verifique as configurações em firebase.js
   - Confirme se as regras do Firestore estão corretas

4. **PWA não instala**
   - Verifique se o manifest.json está correto
   - Confirme se o service worker está registrado
   - Use HTTPS em produção

### Logs e Debugging
- Use `console.log()` para debugging básico
- Use `console.error()` para erros
- Use React DevTools para inspecionar componentes
- Use Network tab para verificar requisições

