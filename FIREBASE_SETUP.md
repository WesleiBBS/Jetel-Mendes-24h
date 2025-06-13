# Configuração do Firebase

## Passos para configurar o Firebase:

1. **Criar projeto no Firebase Console:**
   - Acesse https://console.firebase.google.com/
   - Clique em "Adicionar projeto"
   - Nome do projeto: "pesquisa-satisfacao-jetel"

2. **Configurar Authentication:**
   - No console do Firebase, vá para Authentication
   - Clique em "Começar"
   - Na aba "Sign-in method", habilite "Email/senha"

3. **Configurar Firestore Database:**
   - No console do Firebase, vá para Firestore Database
   - Clique em "Criar banco de dados"
   - Escolha "Iniciar no modo de teste" (depois configure as regras de segurança)
   - Escolha a localização (recomendado: southamerica-east1)

4. **Obter configuração do projeto:**
   - No console do Firebase, vá para Configurações do projeto (ícone de engrenagem)
   - Na seção "Seus aplicativos", clique em "Adicionar app" > "Web"
   - Registre o app com nome "Pesquisa Satisfação PWA"
   - Copie a configuração e substitua no arquivo `src/services/firebase.js`

5. **Configurar regras de segurança do Firestore:**
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

6. **Criar usuário administrador:**
   - No Authentication, adicione um usuário manualmente
   - No Firestore, crie uma coleção "admin_users"
   - Adicione um documento com o UID do usuário criado:
```javascript
{
  email: "admin@jetelmendes.com",
  role: "admin",
  created_at: "timestamp atual",
  last_login: null
}
```

## Estrutura do banco de dados:

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

