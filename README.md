<div align="center">

# Portal da Transparência Mobile

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

**Uma solução moderna e administrativa para consulta e fiscalização de gastos públicos.**


</div>

---

## Visão Geral

O **Portal da Transparência Mobile** é um aplicativo administrativo robusto projetado para oferecer transparência e controle sobre a gestão financeira pública. Construído com tecnologias de ponta, permite auditar despesas, gerenciar entidades e anexar comprovantes fiscais diretamente de dispositivos móveis.

## Funcionalidades Principais

| Módulo | Descrição |
| :--- | :--- |
| **Dashboard Analítico** | Resumo financeiro com gráficos de rosca e barras (Recharts), agrupando gastos por órgão e fornecedor via endpoints de agregação. |
| **Gestão de Despesas** | CRUD completo com listagem, filtros combinados (órgão, fornecedor, faixa de preço), criação, edição e exclusão com confirmação. |
| **Órgãos e Fornecedores** | Gestão de entidades com suporte a listagem paginada. |
| **Gestão de Comprovantes** | Integração nativa para upload de arquivos (PDF/Imagem) vinculados a despesas via câmera, galeria e/ou arquivos. |
| **Visualização Detalhada** | Interface dedicada para conferência minuciosa de dados e acesso rápido a anexos e comprovantes de cada despesa. |

## Funcionalidades secundárias/extras

- **UI/UX**: Suporte nativo a **Dark Mode**, sistema de **Skeleton Loading** para uma experiência fluida em redes lentas e design **Mobile First**.
- **Feedback em Tempo Real**: Notificações via **Toasts** para confirmação de operações e tratamento de erros.
- **Poder Nativo**: Integração profunda com hardware via Capacitor para uso de Câmera e Seletor de Arquivos.
- **Filtros Dinâmicos**: Sistema inteligente de busca e limpeza de filtros ativos para navegação otimizada na aba de despesas.
- **Barra de Busca**: Barra de busca inteligente que permite buscar por nome, id de registro e documento nas abas de fornecedores e orgãos.
- **Ordenação**: O aplicativo conta com um sistema de ordenação dinâmico em todas as listagens (A-Z/Z-A, maior/menor valor, mais recente/antigo).
- **Tratamento de erros e comunicacao com o usuario**: O aplicativo conta com um sistema de tratamento de erros e comunicacao clara com o usuario, exibindo mensagens claras e objetivas para o usuario via **Toasts** ou páginas como em caso de **404**.

---

## Stack

### Core & Frontend
- **React 19**: Biblioteca base para a construção de interfaces reativas e performáticas.
- **TypeScript**: Tipagem rigorosa de todos os contratos da API, eliminando o uso de `any` e garantindo segurança.
- **Vite**: Build tool de última geração para um ciclo de desenvolvimento ultra-rápido.

### Mobile Native
- **Capacitor 8**: Engine cross-platform para execução de código Web em ambiente nativo Android.
- **Native Plugins**: Uso estratégico de `@capacitor/camera`, `@capawesome/capacitor-file-picker` e `Toast`.

### UI & Styling
- **Tailwind CSS 4**: Estilização utilitária de alta performance e customização total.
- **Shadcn/UI**: Componentes acessíveis, modernos e seguindo as melhores práticas de UX.
- **Lucide React**: Biblioteca de ícones leves e consistentes.

### Data & Networking
- **Axios**: Cliente HTTP robusto com interceptors para injeção automática de `X-API-Key`.
- **Recharts**: Visualização de dados financeiros complexos de forma intuitiva e interativa.

---

## 🌐 Acessos públicos

### 🌎 Domínio na Web
- https://portal-da-transparencia-mobile.vercel.app

### 🤖 APK android - disponível para instalação em dispositivos Android
- https://drive.google.com/file/d/1dWShJCwFT-0w1S_4oz0ESZuwueSbk6dq/view?usp=drive_link

---

## ⚙️ Instalação e Configuração

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **Android Studio** (para emulação Android)

### 1. Preparação do Ambiente
```bash
# Navegue até o diretório do projeto
cd portal-transparencia

# Instale as dependências com NPM
npm i
```

### 2. Variáveis de Ambiente
Crie um arquivo `.env` baseado no `.env.example`:
```env
VITE_API_URL=https://avaliacaoapi.ext.topsolutionsrn.com.br/api
VITE_API_KEY=chave-de-api
```

---

## 📱 Emulação no Android Studio

Antes de abrir o projeto no Android Studio, é necessário garantir que o seu ambiente de desenvolvimento nativo está configurado corretamente.

### Passo 1: Variáveis de Ambiente do Sistema (ANDROID_HOME)
Para que o Capacitor consiga compilar o projeto, o seu sistema operacional precisa saber onde o Android SDK está instalado. 

Configure a variável de ambiente `ANDROID_HOME` apontando para o diretório do SDK:
* **Windows:** `C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk`
* **macOS:** `/Users/SEU_USUARIO/Library/Android/sdk`
* **Linux:** `/home/SEU_USUARIO/Android/Sdk`

### Passo 2: Arquivo local.properties
Normalmente, o Android Studio gera este arquivo automaticamente. Porém, é recomendado criá-lo ou verificar sua existência.

Na pasta `android/` do seu projeto, verifique se o arquivo `local.properties` existe. Caso não exista, crie-o e adicione o caminho do seu SDK:

```properties
# Exemplo para macOS/Linux:
sdk.dir=/Users/SEU_USUARIO/Library/Android/sdk

# Exemplo para Windows:
sdk.dir=C\:\\Users\\SEU_USUARIO\\AppData\\Local\\Android\\Sdk
```

### Passo 3: Configuração Nativa no Android Studio
- Clique em Open (Abrir) e selecione especificamente a pasta /portal-transparencia/android do seu projeto.
- Aguarde o Android Studio realizar a sincronização inicial do Gradle. Isso pode levar alguns minutos na primeira vez, pois ele fará o download das dependências nativas.
  
### Passo 4: Configurando Dispositivo Virtual (AVD)
- Acesse Tools > Device Manager (Gerenciador de Dispositivos).
- Clique em Create Device (Criar Dispositivo).
- Selecione um perfil de hardware (utilizei o Pixel 2 e Pixel 4 para validação).
- Escolha uma imagem de sistema (System Image) com API 34 ou superior e finalize a criação do emulador.
- Inicie o emulador.

### Passo 5: Build e Execução
Com o emulador aberto e as configurações validadas, execute os comandos abaixo no diretório raiz para compilar a aplicação e enviá-la ao Android:
```bash
# Build da aplicação Web
npm run build

# Sincronização Capacitor
npx cap sync

# Deploy para o emulador
npx cap run android
```

---

## 💻 Execução Local na Web

### Passo 1: Inicialização do Servidor
1. Abra o terminal.
2. Navegue até a pasta `/portal-transparencia`.
3. Execute o comando `npm run dev`.

### Passo 2: Acessa aplicação
1. Abra o navegador de sua preferência.
2. Acesse o endereço `http://localhost:5173`.

---

## 📂 Estrutura de Diretórios

| Diretório | Responsabilidade |
| :--- | :--- |
| `src/services` | Camada de rede, interceptors Axios e contratos de API. |
| `src/components` | Componentes de UI desenvolvidos por mim e nativos da lib Shadcn/UI. |
| `src/views` | Organização das telas principais e fluxo de navegação. |
| `src/types` | Centralização de interfaces, props e tipos globais TypeScript. |
| `src/hooks` | Custom Hooks reutilizáveis na aplicação (não engloba hooks específicos atrelados a um único componente). |
| `src/utils` | Funções auxiliares e formatadores genéricos. |
| `src/lib` | Configuração e inicialização de biblioteca de terceiros. |
| `src/context` | Gerenciamento de estado global via Context API (ex: `ThemeContext`). |

---

## 👨‍💻 Criador

**Bernardo Medeiros**
