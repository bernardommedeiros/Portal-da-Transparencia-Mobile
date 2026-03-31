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
| **Órgãos e Fornecedores** | Gestão de entidades com suporte a listagem paginada e validação de documentos (CPF/CNPJ) para fornecedores. |
| **Gestão de Comprovantes** | Integração nativa para upload de arquivos (PDF/Imagem) vinculados a despesas via câmera ou galeria. |
| **Visualização Detalhada** | Interface dedicada para conferência minuciosa de dados e acesso rápido a anexos e comprovantes. |

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

### Passo 1: Configuração Nativa
1. Abra o **Android Studio**.
2. Selecione **Open** e aponte para a pasta `/portal-transparencia/android`.
3. Aguarde a sincronização total do Gradle.

### Passo 2: Dispositivo Virtual (AVD)
1. Acesse **Tools** > **Device Manager**.
2. Crie um novo dispositivo (ex: **Pixel 2**).
3. Utilize uma imagem de sistema com **API 34** ou superior.

### Passo 3: Execução
```bash
# Build da aplicação Web
npm run build

# Sincronização Capacitor
npx cap sync

# Deploy para o emulador
npx cap run android
```

Segue vídeo do projeto rodando no emulador e validando funcionalidades: https://drive.google.com/file/d/1955r714l84633121212121212121212/view?usp=sharing

---

## 🌐 Acessos públicos

### Dominio na Web
- https://portal-da-transparencia-mobile.vercel.app/dashboard

### APK android para testes


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

## 📂 Arquitetura do Projeto

| Diretório | Responsabilidade |
| :--- | :--- |
| `src/services` | Camada de rede, interceptors Axios e contratos de API. |
| `src/components` | Componentes de UI desenvolvidos por mim e nativos da lib Shadcn/UI. |
| `src/views` | Organização das telas principais e fluxo de navegação. |
| `src/types` | Centralização de interfaces, props e tipos globais TypeScript. |

---

## Criador

**Bernardo Medeiros**
_*Este projeto é o resultado da avaliação técnica para a equipe de desenvolvimento da **Top Solutions**.*_