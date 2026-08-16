# 🤝 Guia de Contribuição

Obrigado por seu interesse em contribuir! Este documento descreve o processo.

## Como Contribuir

### 1. **Reportar Bugs ou Erros**

Encontrou um erro de conteúdo, ortografia ou interface? Abra uma [Issue](https://github.com/gustavopaccelli/sociologia-ensino-medio/issues) com:

- **Descrição clara** do problema
- **Localização** (qual tópico, qual seção)
- **Sugestão de correção** (se possível)

### 2. **Sugerir Melhorias**

Ideias para novos tópicos, reformulação de conteúdo, ou melhorias de UI/UX? Abra uma Issue com:

- **Tipo:** Feature (nova funcionalidade), Enhancement (melhoria)
- **Descrição** detalhada
- **Exemplos** ou mockups (se apropriado)

### 3. **Enviar Código/Conteúdo**

Para contribuições substanciais:

#### Passo 1: Fork o Repositório
```bash
# Faça fork via GitHub (botão "Fork" no canto superior)
```

#### Passo 2: Clone Localmente
```bash
git clone https://github.com/SEU-USERNAME/sociologia-ensino-medio.git
cd sociologia-ensino-medio
```

#### Passo 3: Crie uma Branch
```bash
# Use nomes descritivos
git checkout -b feature/novo-topico-sobre-educacao
git checkout -b fix/correcao-typo-cultura
git checkout -b docs/melhorar-roadmap
```

**Padrão de nomes:**
- `feature/` - Novo conteúdo ou funcionalidade
- `fix/` - Correção de erro
- `docs/` - Alterações em documentação
- `refactor/` - Reorganização de código sem mudar comportamento

#### Passo 4: Faça Alterações

**Para Adicionar Novo Tópico:**

1. Edite `index.html` e localize o array `topicsData`
2. Adicione um novo objeto:

```javascript
{
    id: "seu-topico-id",  // minúsculo, sem espaços
    title: "N. Nome do Tópico",  // Inclua número
    emoji: "🎯",  // Emoji apropriado
    parent: null,
    content: `
        <h2 class="text-3xl font-bold mb-2 text-gray-900">Nome do Tópico</h2>
        <p class="text-gray-500 mb-6">Subtítulo descritivo</p>
        
        <div class="callout info mb-6">
            <p class="font-semibold mb-2">💡 Conceito-chave</p>
            <p>Explicação breve e clara.</p>
        </div>
        
        <!-- Seu conteúdo aqui -->
    `
}
```

**Tipos de Callout Disponíveis:**
- `.callout.info` - Informações importantes
- `.callout.success` - Dicas e resumos
- `.callout.warning` - Avisos
- `.callout.critical` - Informações críticas

**Para Expandir Tópico Existente:**

1. Localize o tópico em `topicsData`
2. Expanda a string `content` com:

```javascript
<div class="toggle-box bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
    <button class="toggle-btn font-semibold text-gray-800 w-full text-left flex justify-between items-center" data-toggle="toggleN">
        <span>📚 Título da Seção Expansível</span>
        <span>+</span>
    </button>
    <div class="toggle-content" id="toggleN">
        <!-- Conteúdo que expande ao clicar -->
        <p class="text-gray-700 mt-4">Seu conteúdo aqui.</p>
    </div>
</div>
```

#### Passo 5: Commit com Mensagens Claras
```bash
# Bom
git commit -m "feat: adicionar tópico Políticas Públicas

- Seção sobre o que são políticas públicas
- Análise de policy-making no Brasil
- Toggles com exemplos práticos"

# Também bom
git commit -m "fix: corrigir ortografia em Teoria da Dependência"
git commit -m "docs: melhorar estrutura de contribuição"

# Evitar
git commit -m "atualizado"
git commit -m "x"
```

**Formato recomendado:**
```
<tipo>: <descrição breve>

<descrição opcional mais longa>
<listas de mudanças se necessário>
```

#### Passo 6: Push para seu Fork
```bash
git push origin feature/seu-nome-descritivo
```

#### Passo 7: Abra um Pull Request

1. Vá para https://github.com/gustavopaccelli/sociologia-ensino-medio
2. Clique em "Compare & pull request"
3. Preencha:
   - **Título:** Breve descrição
   - **Descrição:** O que mudou, por quê, qualquer contexto
   - **Checklist:**
     - [ ] Testei no navegador (desktop e mobile)
     - [ ] Conteúdo é factualmente correto
     - [ ] Segui o padrão de código
     - [ ] Sem erros ortográficos

## Padrões de Código

### HTML
- Use classes Tailwind CSS para estilo
- Sempre adicione `class="text-gray-700"` em parágrafos para legibilidade
- Mantenha semântica HTML (não use divs para tudo)

### JavaScript
- Sem bibliotecas externas (mantenha vanilla.js)
- Use camelCase para variáveis
- Comente código complexo

### Conteúdo
- Use **linguagem clara e acessível**
- Evite jargão sem definição
- Sempre cite fontes quando possível
- Mantenha tom neutro e respeitoso

## Revisão de Pull Request

Um dos mantenedores revisará seu PR em até 7 dias. Pode haver:

- 💚 Aprovação direta (raro)
- 💛 Solicitação de mudanças (comum - é normal!)
- 🔴 Recusa (se desalinhado com escopo do projeto)

Esteja aberto a feedback e pergunte se algo não ficar claro!

## Código de Conduta

- Seja respeitoso com outros contribuidores
- Não discrimine por qualquer razão
- Foque no conteúdo/código, não na pessoa
- Denuncie comportamento abusivo aos mantenedores

## Dúvidas?

- Abra uma [Discussion](https://github.com/gustavopaccelli/sociologia-ensino-medio/discussions)
- Mencione um mantenedor em uma Issue
- Envie email (veja GitHub profile)

---

**Obrigado por contribuir!** 🎉
