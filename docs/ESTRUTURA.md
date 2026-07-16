# 🏗️ Estrutura Técnica do Projeto

## Visão Geral

Esta é uma **Single Page Application (SPA)** pura HTML/CSS/JavaScript, sem dependências npm (exceto Tailwind CSS via CDN).

---

## 📦 Arquitetura

### Camadas

```
Apresentação (UI)
    ↓
Lógica de Aplicação (JS)
    ↓
Dados (Array JavaScript)
    ↓
(Sem camada de backend)
```

### Fluxo de Dados

1. **Inicialização:** `app.init()` renderiza navegação
2. **Interação:** Usuário clica em tópico
3. **Seleção:** `app.selectTopic(topicId)` procura tópico em `topicsData`
4. **Renderização:** `app.updateContent(topic)` injeta HTML no DOM
5. **Interatividade:** Event listeners para toggles e busca

---

## 📄 Estrutura de Dados

### Formato do Tópico

```javascript
{
    id: "string-unico",              // identificador único (minúsculo, sem espaços)
    title: "N. Nome do Tópico",      // número + nome (aparece na sidebar)
    emoji: "📚",                       // emoji representativo
    parent: null,                      // (futuro: suporte a subtópicos)
    content: `HTML como string`        // conteúdo HTML renderizado
}
```

### Array `topicsData`

Localização: `index.html`, dentro de `<script>`

```javascript
const topicsData = [
    { /* Tópico 1 */ },
    { /* Tópico 2 */ },
    // ...
];
```

Total atual: 12 tópicos | Planejado: 23 tópicos

---

## 🎨 Sistema de Design

### Tailwind CSS

**Versão:** Via CDN (sem instalação necessária)

```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Cores Utilizadas:**
- `gray-50` a `gray-900` - Escala de cinza
- `blue-400/600` - Info (callout)
- `green-600` - Success (callout)
- `yellow-400/600` - Warning (callout)
- `red-600` - Critical (callout)

### Componentes Reutilizáveis

#### 1. **Callout Box**

```html
<div class="callout info/success/warning/critical mb-6">
    <p class="font-semibold mb-2">emoji Título</p>
    <p>Conteúdo explanatório</p>
</div>
```

**Classes CSS:**
```css
.callout {
    border-left: 4px solid;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: rgba(0,0,0,0.02);
}

.callout.info {
    border-color: #3b82f6;
    background-color: #eff6ff;
}
/* Similar para success, warning, critical */
```

#### 2. **Toggle/Dropdown Expansível**

```html
<div class="toggle-box bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
    <button class="toggle-btn font-semibold text-gray-800 w-full text-left flex justify-between items-center" 
            data-toggle="toggleN">
        <span>Título</span>
        <span>+</span>
    </button>
    <div class="toggle-content" id="toggleN">
        <!-- Conteúdo expandível -->
    </div>
</div>
```

**Comportamento:**
- Clique no botão expande/contrai
- Animação suave (max-height transition)
- Ícone muda de `+` para `−`

---

## 🔧 JavaScript - Objeto `app`

### Propriedades

```javascript
app = {
    currentTopic: null,           // ID do tópico atualmente exibido
    allTopics: topicsData,        // Todos os tópicos (cópia de referência)
    filteredTopics: topicsData,   // Tópicos filtrados pela busca
}
```

### Métodos

#### `app.init()`
Chamado ao carregar página. Inicializa navegação e event listeners.

```javascript
app.init() {
    this.renderNavigation();
    this.setupEventListeners();
    this.setupToggleListeners();
}
```

#### `app.renderNavigation()`
Renderiza lista de tópicos na sidebar a partir de `this.filteredTopics`.

```javascript
// Exemplo de saída:
// <div class="nav-item">📚 1. Indivíduo e Sociedade</div>
// <div class="nav-item">🔬 2. A Sociologia como Ciência</div>
```

#### `app.selectTopic(topicId)`
Seleção de tópico por usuário. Fluxo:
1. Procura tópico em `allTopics`
2. Atualiza `currentTopic`
3. Chama `updateContent()` e `updateBreadcrumb()`
4. Fecha sidebar em mobile

#### `app.updateContent(topic)`
Injeta conteúdo HTML do tópico no `#contentArea`.

```javascript
document.getElementById('contentArea').innerHTML = topic.content;
// Setup novo listeners para toggles
this.setupToggleListeners();
```

#### `app.updateBreadcrumb(topic)`
Atualiza trilha de navegação no topo.

```
📚 Sociologia / Nome do Tópico Atual
```

#### `app.setupToggleListeners()`
Ataca event listeners a todos os `.toggle-btn`.

#### `app.filterTopics(query)`
Filtra tópicos por texto de busca (em tempo real).

```javascript
const query = "trabalho";
// Filtra por title e id
this.filteredTopics = this.allTopics.filter(topic =>
    topic.title.toLowerCase().includes(query)
);
this.renderNavigation(); // Re-renderiza com resultados
```

#### `app.closeSidebarMobile()`
Fecha sidebar em dispositivos mobile.

---

## 🎯 Event Listeners

### Busca em Tempo Real

```javascript
document.getElementById('searchInput').addEventListener('input', (e) => {
    app.filterTopics(e.target.value);
});
```

**Comportamento:** A cada keystroke, filtra tópicos e re-renderiza.

### Menu Hamburger

```javascript
document.getElementById('hamburgerBtn').addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
});
```

**Comportamento:** Toggle da classe `.open` na sidebar (posição fixed, z-index).

### Toggle de Seções

```javascript
const toggleButtons = document.querySelectorAll('.toggle-btn');
toggleButtons.forEach(btn => {
    btn.addEventListener('click', this.handleToggle);
});
```

**Comportamento:**
- Adiciona/remove classe `.active` no `.toggle-content`
- CSS transition anima max-height
- Ícone muda de `+` para `−`

---

## 📱 Responsividade

### Breakpoints (Tailwind)

| Tailwind | Pixels | Uso |
|----------|--------|-----|
| `sm` | 640px | Tablets pequenos |
| `md` | 768px | Tablets e acima |
| `lg` | 1024px | Desktops |
| `xl` | 1280px | Desktops grandes |

### Mudanças em Mobile

```css
@media (max-width: 768px) {
    .hamburger { display: block; }
    .sidebar { position: fixed; left: -100%; width: 280px; }
    .sidebar.open { left: 0; }
}
```

**Comportamento:**
- Sidebar sai da tela (left: -100%)
- Hamburger menu aparece
- Clique abre sidebar com overlay escuro
- Clique no overlay fecha

---

## 🔍 Busca - Implementação

### Algoritmo

```javascript
filterTopics(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
        this.filteredTopics = this.allTopics;
    } else {
        this.filteredTopics = this.allTopics.filter(topic =>
            topic.title.toLowerCase().includes(query) ||
            topic.id.toLowerCase().includes(query)
        );
    }
    
    this.renderNavigation(); // Re-renderiza
}
```

**Características:**
- Case-insensitive
- Procura em `title` e `id`
- Busca parcial (substring)
- Sem delay (instantânea)

### Performance

Para 23+ tópicos, o filtro é rápido o suficiente. Se expandir para 100+ tópicos, considerar:
- Debounce (aguardar ~300ms após keystroke)
- Índice pré-compilado
- Busca com stemming (reduzir palavras)

---

## 🚀 Deploy

### GitHub Pages

**Arquivo:** `.github/workflows/pages.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/configure-pages@v2
      - uses: actions/upload-pages-artifact@v1
        with:
          path: '.'
      - uses: actions/deploy-pages@v1
```

**Fluxo:**
1. Push em `main`
2. GitHub Actions ativa workflow
3. Arquivos uploadados para gh-pages
4. Site publicado em `https://gustavopaccelli.github.io/sociologia-ensino-medio`

---

## 📊 Performance

### Carregamento Inicial

```
HTML parseado:          50ms
Tailwind CSS (CDN):     200-500ms
JavaScript executado:   100ms
DOM renderizado:        50ms
---
Total:                  ~400-700ms (dependendo de conexão)
```

### Ao Mudar de Tópico

```
Busca em array:         <1ms
HTML atualizado:        10-20ms
Event listeners:        5-10ms
---
Total:                  ~15-30ms (instantâneo para usuário)
```

### Otimizações Implementadas

- ✅ Tailwind via CDN (não compila localmente)
- ✅ Sem imagens (apenas emojis)
- ✅ Sem frameworks pesados (vanilla JS)
- ✅ Dados em memória (sem requisições HTTP)

### Possíveis Otimizações Futuras

- [ ] Lazy load de conteúdo (carregar tópico apenas se clicado)
- [ ] Service worker para offline
- [ ] Minificar CSS/JS
- [ ] Compressão de conteúdo

---

## 🔐 Segurança

### Considerações Atuais

- ✅ Nenhuma entrada do usuário é salva (localStorage não usado)
- ✅ Nenhuma requisição de API (sem CORS issues)
- ✅ Nenhuma autenticação necessária
- ✅ Conteúdo estático (sem injeção de SQL)

### Ao Adicionar Features Futuras

- [ ] Validar inputs de comentários (XSS)
- [ ] HTTPS obrigatório
- [ ] CORS headers se API adicionada
- [ ] Rate limiting para API

---

## 📝 Convenções de Código

### Nomes

```javascript
// ✅ Bom
const currentTopic = "trabalho";
const filteredTopics = [];
function renderNavigation() {}

// ❌ Evitar
const ct = "trabalho";
const ft = [];
function rNav() {}
```

### Comentários

```javascript
// ✅ Quando necessário (lógica complexa)
// Calcula Gini index usando array de rendas
const giniIndex = calculateGini(incomeArray);

// ❌ Óbvio demais
// Incrementa contador
count++;
```

### Estrutura de Arquivo

```
index.html
    ├── <head> - Meta tags, Tailwind CDN
    ├── <body>
    │   ├── Estrutura HTML (semantic)
    │   └── <script>
    │       ├── CSS customizado
    │       ├── const topicsData
    │       └── const app { ... }
    └── Event listeners no final
```

---

## 🧪 Testando Localmente

### 1. Abrir em Navegador

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 2. Com Live Server (VSCode)

```
- Instale extensão "Live Server"
- Right-click em index.html
- Open with Live Server
- Salve e navegador atualiza automaticamente
```

### 3. Com Python

```bash
# Python 3
python -m http.server 8000

# Abra http://localhost:8000
```

### Checklist de Teste

- [ ] Busca funciona (filtro em tempo real)
- [ ] Clique em tópico abre conteúdo
- [ ] Toggles expandem/contraem
- [ ] Breadcrumb atualiza
- [ ] Mobile responsive (abrir DevTools, F12, Ctrl+Shift+M)
- [ ] Hamburger menu funciona
- [ ] Sem erros no console (F12 → Console)

---

Última atualização: Julho 2026
