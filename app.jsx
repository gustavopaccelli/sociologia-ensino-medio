import * as Accordion from 'https://esm.sh/@radix-ui/react-accordion@1.2.0?deps=react@18.3.1,react-dom@18.3.1';
import * as Dialog from 'https://esm.sh/@radix-ui/react-dialog@1.1.2?deps=react@18.3.1,react-dom@18.3.1';
import * as Checkbox from 'https://esm.sh/@radix-ui/react-checkbox@1.1.2?deps=react@18.3.1,react-dom@18.3.1';
import * as RadioGroup from 'https://esm.sh/@radix-ui/react-radio-group@1.2.0?deps=react@18.3.1,react-dom@18.3.1';
import * as Toast from 'https://esm.sh/@radix-ui/react-toast@1.2.1?deps=react@18.3.1,react-dom@18.3.1';

const { useState, useEffect, useMemo, useRef } = React;

const cn = (...a) => a.filter(Boolean).join(' ');
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};
const allTopics = getAllTopicsFlat();
const topicById = id => allTopics.find(t => t.id === id);
const quizTitle = id => (quizzesData.find(q => q.topicId === id) || {}).topicTitle || id;

const P = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  chevron: 'M6 9l6 6 6-6',
  check: 'M5 12l5 5L20 7',
  x: 'M6 6l12 12M18 6L6 18',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6'
};
const Svg = ({ d, size = 16, stroke = 2, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={d} />
  </svg>
);

const buttonVariants = {
  default: 'bg-[#0075de] text-white hover:bg-[#005bab]',
  outline: 'border border-[#e4e4e7] bg-white text-[#02093a] hover:bg-[#f4f4f5]',
  secondary: 'bg-[#e6f3fe] text-[#005bab] hover:bg-[#d5eafc]',
  ghost: 'text-[#005bab] hover:bg-[#e6f3fe]',
  success: 'bg-[#15803d] text-white hover:bg-[#166534]',
  muted: 'bg-[#f4f4f5] text-[#02093a] hover:bg-[#e4e4e7]'
};
function Button({ variant = 'default', size = 'md', className = '', ...props }) {
  const sizes = { md: 'h-9 px-4 py-2', lg: 'h-11 px-6 py-3 text-base', sm: 'h-8 px-3 text-xs' };
  return (
    <button
      className={cn('inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2', buttonVariants[variant], sizes[size], className)}
      {...props}
    />
  );
}
const Card = ({ className = '', ...p }) => <div className={cn('rounded-lg border border-[#e4e4e7] bg-white', className)} {...p} />;
const Badge = ({ className = '', ...p }) => <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', className)} {...p} />;
const Input = ({ className = '', ...p }) => (
  <input className={cn('flex h-9 w-full rounded-md border border-[#e4e4e7] bg-white px-3 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]', className)} {...p} />
);

const toastStyle = {
  success: 'border-[#cde6fc] bg-[#e6f3fe] text-[#02093a]',
  warning: 'border-[#fde68a] bg-[#fffbeb] text-[#92400e]',
  error: 'border-[#fecaca] bg-[#fef2f2] text-[#991b1b]',
  info: 'border-[#cde6fc] bg-white text-[#02093a]'
};

function App() {
  const [page, setPage] = useState('home');
  const [topicId, setTopicId] = useState(null);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState(() => store.get('categoryStates', {}));
  const [navOpen, setNavOpen] = useState(false);
  const [pixOpen, setPixOpen] = useState(false);
  const [zoomSrc, setZoomSrc] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [quizTopic, setQuizTopic] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState({});
  const [enemData, setEnemData] = useState([]);
  const [enemSelected, setEnemSelected] = useState(() => store.get('enemSelectedTopics', { topics: [] }).topics || []);
  const [enemPicker, setEnemPicker] = useState('');
  const [enemQ, setEnemQ] = useState(null);
  const [enemChoice, setEnemChoice] = useState(null);
  const [enemAnswered, setEnemAnswered] = useState({});
  const scrollRef = useRef(null);

  useEffect(() => { localStorage.setItem('hasVisitedBefore', 'true'); }, []);
  useEffect(() => {
    fetch('./enem_questions.json').then(r => r.json()).then(setEnemData).catch(e => console.warn('ENEM', e));
  }, []);
  useEffect(() => {
    store.set('enemSelectedTopics', { topics: enemSelected, timestamp: new Date().toISOString() });
  }, [enemSelected]);

  const toast = (msg, type = 'success', dur = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type, dur }]);
  };
  const dismissToast = id => setToasts(t => t.filter(x => x.id !== id));

  const go = p => {
    setPage(p);
    setNavOpen(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };
  const goHome = () => { setQuery(''); setTopicId(null); go('home'); };
  const openTopic = id => { setTopicId(id); go('topic'); };
  const openQuizzes = () => { setQuizTopic(null); go('quizzes'); };
  const openEnem = () => { setEnemQ(null); setEnemChoice(null); go('enem'); };

  const navCats = useMemo(() => {
    const q = query.trim().toLowerCase();
    return topicsCategories
      .map(c => ({ ...c, shown: q ? c.topics.filter(t => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) : c.topics }))
      .filter(c => c.shown.length > 0);
  }, [query]);
  const openCats = query ? navCats.map(c => c.id) : topicsCategories.filter(c => !collapsed[c.id]).map(c => c.id);
  const onOpenCats = value => {
    if (query) return;
    const next = {};
    topicsCategories.forEach(c => { next[c.id] = !value.includes(c.id); });
    store.set('categoryStates', next);
    setCollapsed(next);
  };

  const onToggleContent = e => {
    const b = e.target.closest('.toggle-btn');
    if (!b) return;
    const c = document.getElementById(b.dataset.toggle);
    if (!c) return;
    const open = c.classList.toggle('active');
    b.setAttribute('aria-expanded', open);
    const ic = b.querySelector('span:last-child');
    if (ic) ic.classList.toggle('rotated', open);
  };

  // ENEM
  const enemTopics = useMemo(() => {
    const ids = [...new Set(enemData.flatMap(q => q.topicos))];
    return ids.map(id => {
      const t = topicById(id);
      return { id, title: t ? t.title : id, count: enemData.filter(q => q.topicos.includes(id)).length };
    }).sort((a, b) => b.count - a.count);
  }, [enemData]);
  const enemTotal = enemTopics.filter(t => enemSelected.includes(t.id)).reduce((s, t) => s + t.count, 0);
  const enemShown = enemTopics.filter(t => t.title.toLowerCase().includes(enemPicker.trim().toLowerCase()));
  const enemProgress = enemSelected.length === 0 ? 'Selecione pelo menos 1 tópico'
    : enemSelected.length < 5 ? `Você pode adicionar mais ${5 - enemSelected.length} tópicos`
    : 'Pronto! Clique em "Sortear Questão"';
  const toggleEnemTopic = id => setEnemSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const sortear = () => {
    if (enemSelected.length === 0) { toast('Selecione pelo menos um tópico.', 'warning', 4000); return; }
    const pool = enemData.filter(q => q.topicos.some(t => enemSelected.includes(t)));
    if (pool.length === 0) { toast('Nenhuma questão encontrada para o tópico selecionado.', 'error', 4000); return; }
    let pick = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && enemQ) while (pick.id === enemQ.id) pick = pool[Math.floor(Math.random() * pool.length)];
    setEnemQ(pick);
    setEnemChoice(null);
    toast(`Questão sorteada: ${pick.source}`, 'success', 3000);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const responder = () => {
    if (!enemChoice) { toast('Selecione uma opção.', 'warning', 3000); return; }
    setEnemAnswered(p => ({ ...p, [enemQ.id]: enemChoice === enemQ.correctAnswer }));
  };

  const renderBlocks = q => {
    const blocos = q.blocks || [];
    if (!blocos.length) return <p className="enem-paragrafo">{q.enunciado || ''}</p>;
    return blocos.map((b, i) => {
      if (b.type === 'label') return <p key={i} className="enem-rotulo">{b.text}</p>;
      if (b.type === 'citation') return <p key={i} className="enem-fonte">{b.text}</p>;
      if (b.type === 'image') {
        const src = `./images/enem/${encodeURIComponent(b.src)}`;
        return (
          <figure key={i} className="enem-figura">
            <button type="button" onClick={() => setZoomSrc(src)} className="cursor-zoom-in">
              <img src={src} alt="Material de apoio da questão" loading="lazy" />
            </button>
            <figcaption>Clique na imagem para ampliar</figcaption>
          </figure>
        );
      }
      return <p key={i} className="enem-paragrafo">{b.text}</p>;
    });
  };

  // Navigation panel (desktop sidebar and mobile dialog)
  const NavPanel = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#e4e4e7] p-6">
        <button onClick={goHome} className="mb-4 w-full select-none text-left text-xl font-bold text-gray-900 transition-colors hover:text-[#005bab]" aria-label="Voltar para página inicial do portal">
          Sociologia
        </button>
        <label htmlFor={`search-${navOpen ? 'm' : 'd'}`} className="sr-only">Buscar tópicos de sociologia</label>
        <Input id={`search-${navOpen ? 'm' : 'd'}`} type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar tópicos..." />
      </div>
      <nav className="flex-1 overflow-y-auto p-3" aria-label="Lista de tópicos">
        {navCats.length === 0 && <p className="py-8 text-center text-sm text-gray-500">Nenhum tópico encontrado</p>}
        <Accordion.Root type="multiple" value={openCats} onValueChange={onOpenCats}>
          {navCats.map(c => (
            <Accordion.Item key={c.id} value={c.id} className="mb-1">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-gray-900 transition-colors hover:bg-black/[0.03] hover:text-[#005bab]">
                  <span className="min-w-0 flex-1 truncate">{c.title}</span>
                  <span className="text-xs font-normal text-gray-500">{c.shown.length}</span>
                  <Svg d={P.chevron} size={16} className="shrink-0 text-[#005bab] transition-transform group-data-[state=closed]:-rotate-90" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden">
                <ul className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-[#e4e4e7] pl-2">
                  {c.shown.map(t => {
                    const active = page === 'topic' && topicId === t.id;
                    return (
                      <li key={t.id}>
                        <button onClick={() => openTopic(t.id)} aria-current={active ? 'page' : undefined}
                          className={cn('block w-full truncate rounded-md px-3 py-2 text-left text-sm transition-colors', active ? 'bg-black/[0.04] font-medium text-[#005bab]' : 'text-gray-700 hover:bg-black/[0.03]')}>
                          {t.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </nav>
      <div className="border-t border-[#e4e4e7] p-4 text-center text-xs text-gray-500">Estruturado para ENEM e Vestibulares</div>
    </div>
  );

  // Views
  const homeView = (
    <>
      <Card className="mb-8 p-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Bem-vindo ao Portal de Sociologia para o Ensino Médio</h1>
        <p className="mb-6 text-lg text-gray-700">
          Explore tópicos de Sociologia com foco na realidade brasileira.
          Conteúdo estruturado para complementar suas aulas, preparar para o vestibular
          e desenvolver seu pensamento crítico sobre a sociedade.
        </p>
        <div className="callout info mb-4">
          <p className="mb-2 font-semibold">Como usar este portal:</p>
          <p className="text-gray-700">Use o <strong>buscador</strong> para encontrar tópicos | <strong>Clique nos tópicos</strong> para aprofundar</p>
          <p className="mt-3 text-gray-700">Aprender Sociologia é compreender como a sociedade funciona e refletir criticamente sobre questões importantes. Comece por qualquer tema do seu interesse.</p>
        </div>
        <div className="callout mb-4">
          <p className="mb-2 font-semibold">Teste seus conhecimentos:</p>
          <p className="mb-4 text-gray-700">
            Avalie sua compreensão sobre cada tópico com <strong>200 Quizzes Interativas</strong> (Verdadeiro/Falso) e <strong>241 Questões reais do ENEM</strong>. Pratique, aprenda e se prepare para o vestibular!
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="flex-1" onClick={openQuizzes}>Ir para Quizzes</Button>
            <Button className="flex-1" onClick={openEnem}>Questões ENEM</Button>
          </div>
        </div>
      </Card>
      <p className="py-8 text-center text-lg text-gray-600">Selecione um tópico na barra lateral para começar, ou use a busca acima</p>
    </>
  );

  const quizzesView = () => {
    if (!quizTopic) {
      const ids = [...new Set(quizzesData.map(q => q.topicId))];
      return (
        <>
          <div className="mb-8">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">Quizes de Sociologia</h1>
            <p className="mb-8 text-gray-600">Teste seus conhecimentos com quizes Verdadeiro/Falso sobre cada tópico. Clique em um tema para começar.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ids.map(id => {
              const qs = quizzesData.filter(q => q.topicId === id);
              return (
                <Card key={id} role="button" tabIndex={0} onClick={() => setQuizTopic(id)}
                  onKeyDown={e => { if (e.key === 'Enter') setQuizTopic(id); }}
                  className="cursor-pointer p-6 transition-shadow hover:border-[#0075de]">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{qs[0].topicTitle}</h3>
                  <p className="mb-3 text-sm text-gray-600">{qs.length} questões</p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-[#005bab]">Começar <Svg d={P.arrow} size={14} /></div>
                </Card>
              );
            })}
          </div>
        </>
      );
    }
    const qs = quizzesData.filter(q => q.topicId === quizTopic);
    const answered = qs.filter(q => quizAnswered[q.id] !== undefined);
    const correct = answered.filter(q => quizAnswered[q.id] === q.correctAnswer);
    const pct = answered.length ? Math.round(correct.length / answered.length * 100) : 0;
    return (
      <>
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-4 px-0" onClick={() => setQuizTopic(null)}>
            <Svg d={P.back} size={14} /> Voltar aos temas
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">{qs[0].topicTitle}</h2>
          <p className="mb-4 text-sm text-gray-600">Responda as questões Verdadeiro ou Falso</p>
          <Card className="bg-[#e6f3fe] p-4 border-[#cde6fc]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-gray-700">
              <span>Progresso: <span className="text-[#005bab]">{answered.length}/{qs.length}</span> questões respondidas</span>
              {answered.length > 0 && <span>Acertos: <span className="text-[#15803d]">{correct.length}/{answered.length}</span> ({pct}%)</span>}
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-[#0075de] transition-all" style={{ width: `${(answered.length / qs.length) * 100}%` }} />
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          {qs.map((q, i) => {
            const a = quizAnswered[q.id];
            const done = a !== undefined;
            const ok = done && a === q.correctAnswer;
            return (
              <Card key={q.id} className={cn('p-6', done && (ok ? 'border-[#86efac] bg-[#f0fdf4]' : 'border-[#fca5a5] bg-[#fef2f2]'))}>
                <div className="mb-4 flex items-start justify-between">
                  <div className="font-bold text-gray-900">Questão {i + 1}</div>
                  {done && <Badge className={ok ? 'border-[#86efac] text-[#15803d]' : 'border-[#fca5a5] text-[#b91c1c]'}>{ok ? 'Correto' : 'Incorreto'}</Badge>}
                </div>
                <p className="mb-4 font-medium text-gray-800">{q.question}</p>
                <div className="mb-4 flex gap-3">
                  {[true, false].map(v => (
                    <Button key={String(v)} variant={a === v ? (v ? 'success' : 'default') : 'muted'} disabled={done} className="flex-1 py-3"
                      onClick={() => setQuizAnswered(p => ({ ...p, [q.id]: v }))}>
                      {v ? 'Verdadeiro' : 'Falso'}
                    </Button>
                  ))}
                </div>
                {done && (
                  <div className="rounded-md border-l-4 border-[#0075de] bg-[#e6f3fe] p-3 text-sm">
                    <p className="mb-1 font-semibold text-[#02093a]">Explicação:</p>
                    <p className="text-[#02093a]">{q.explanation}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </>
    );
  };

  const enemPickerView = (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Banco de Questões ENEM - Sociologia</h1>
        <p className="mb-6 text-gray-600">241 questões reais de ENEM (com gabarito oficial) categorizadas por tema. Selecione um ou mais tópicos e clique em "Sortear Questão".</p>
      </div>
      <Card className="mb-8 bg-[#e6f3fe] p-6 border-[#cde6fc]">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Escolha os tópicos</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEnemSelected(enemTopics.map(t => t.id))}>Selecionar todos</Button>
            <Button variant="outline" size="sm" onClick={() => setEnemSelected([])}>Limpar seleção</Button>
          </div>
        </div>
        <Input className="mb-4 h-10" type="search" value={enemPicker} onChange={e => setEnemPicker(e.target.value)} placeholder="Buscar tópicos (ex: Raça, Gênero)..." aria-label="Buscar tópicos por nome" />
        <Card className="mb-3 p-3 text-sm">
          <span className="font-medium text-gray-900">{enemSelected.length} {enemSelected.length === 1 ? 'tópico' : 'tópicos'} selecionado{enemSelected.length === 1 ? '' : 's'} ({enemTotal} {enemTotal === 1 ? 'questão' : 'questões'})</span>
          <span className="ml-2 text-gray-600">{enemProgress}</span>
        </Card>
        {enemShown.length === 0 && <p className="py-8 text-center text-gray-500">Nenhum tópico encontrado. Tente outra busca.</p>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {enemShown.map(t => {
            const on = enemSelected.includes(t.id);
            return (
              <label key={t.id} className={cn('flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border-2 bg-white p-3 transition-colors', on ? 'border-[#0075de] bg-[#e6f3fe]' : 'border-[#e4e4e7] hover:border-[#cde6fc]')}>
                <Checkbox.Root checked={on} onCheckedChange={() => toggleEnemTopic(t.id)} aria-label={`${t.title} (${t.count} questões)`}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-gray-500 bg-white data-[state=checked]:border-[#0075de] data-[state=checked]:bg-[#0075de]">
                  <Checkbox.Indicator><Svg d={P.check} size={14} stroke={3} className="text-white" /></Checkbox.Indicator>
                </Checkbox.Root>
                <span className="flex-1 font-medium text-gray-900">{t.title}</span>
                <span className="whitespace-nowrap text-sm text-gray-600">({t.count})</span>
              </label>
            );
          })}
        </div>
      </Card>
      <div className="flex flex-wrap gap-4">
        <Button size="lg" className="flex-1" onClick={sortear}>Sortear Questão</Button>
        <Button size="lg" variant="muted" onClick={() => { setEnemSelected([]); setEnemQ(null); }}>Limpar</Button>
      </div>
    </>
  );

  const enemQuestionView = () => {
    const q = enemQ;
    const ans = enemAnswered[q.id];
    const done = ans !== undefined;
    const vals = Object.values(enemAnswered);
    const correctCount = vals.filter(v => v === true).length;
    const answeredCount = vals.length;
    return (
      <>
        <div className="mb-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Questão {q.volume}-{q.number} • {q.source}
                {q.nivel && <Badge className={cn('ml-2', q.nivel === 'dificil' ? 'border-[#fca5a5] text-[#b91c1c]' : 'border-[#fde68a] text-[#92400e]')}>{q.nivel === 'dificil' ? 'Difícil' : 'Médio'}</Badge>}
              </p>
              <p className="mt-1 text-xs text-gray-500">Tópicos: {q.topicos.map(t => { const tp = topicById(t); return tp ? tp.title : t; }).join(', ')}</p>
            </div>
            {answeredCount > 0 && (
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-gray-700">Sua pontuação</p>
                <p className="text-2xl font-bold text-[#005bab]">{correctCount}/{answeredCount}</p>
                <p className="text-xs text-gray-600">{Math.round(correctCount / answeredCount * 100)}% acertos</p>
              </div>
            )}
          </div>
          <article className="enem-suporte mb-6">{renderBlocks(q)}</article>
          <p className="enem-enunciado mb-5">{q.enunciado}</p>
          <RadioGroup.Root value={enemChoice || ''} onValueChange={setEnemChoice} disabled={done} className="mb-6 flex flex-col gap-3" aria-label="Alternativas">
            {Object.entries(q.options).map(([letter, text]) => {
              const isCorrect = done && letter === q.correctAnswer;
              const isWrong = done && enemChoice === letter && letter !== q.correctAnswer;
              return (
                <label key={letter} htmlFor={`opt-${letter}`}
                  className={cn('flex cursor-pointer items-start gap-4 rounded-lg border-2 bg-white p-4 transition-colors', isCorrect ? 'border-[#22c55e] bg-[#f0fdf4]' : isWrong ? 'border-[#ef4444] bg-[#fef2f2]' : enemChoice === letter ? 'border-[#0075de] bg-[#e6f3fe]' : 'border-[#e4e4e7] hover:border-[#cde6fc]', done && 'cursor-default')}>
                  <RadioGroup.Item id={`opt-${letter}`} value={letter}
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-500 bg-white data-[state=checked]:border-[#0075de]">
                    <RadioGroup.Indicator className="block h-2.5 w-2.5 rounded-full bg-[#0075de]" />
                  </RadioGroup.Item>
                  <span className="flex-1 text-gray-800"><span className="font-bold text-gray-900">{letter})</span> <span className="ml-1">{text}</span></span>
                  {isCorrect && <Svg d={P.check} size={18} stroke={3} className="mt-0.5 text-[#15803d]" />}
                </label>
              );
            })}
          </RadioGroup.Root>
          <div className="flex flex-wrap gap-3">
            <Button variant="success" size="lg" className="flex-1" onClick={responder} disabled={done}>Responder</Button>
            <Button size="lg" className="flex-1" onClick={sortear}>Próxima Questão</Button>
            <Button size="lg" variant="muted" onClick={() => { setEnemQ(null); setEnemChoice(null); }}>Voltar</Button>
          </div>
          {done && (
            <Card className={cn('mt-6 border-l-4 p-4', ans ? 'border-l-[#22c55e] bg-[#f0fdf4]' : 'border-l-[#ef4444] bg-[#fef2f2]')}>
              <p className={cn('font-semibold', ans ? 'text-[#14532d]' : 'text-[#7f1d1d]')}>{ans ? 'Correto!' : 'Incorreto!'}</p>
              {!ans && <p className="mt-2 text-sm text-[#7f1d1d]"><strong>Resposta correta:</strong> {q.correctAnswer}) {q.options[q.correctAnswer]}</p>}
              {q.justificativa && (
                <div className="mt-3 border-t border-[#e4e4e7] pt-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">Comentário</p>
                  <p className="text-sm text-gray-800" style={{ textAlign: 'justify', lineHeight: 1.65 }}>{q.justificativa}</p>
                </div>
              )}
            </Card>
          )}
        </div>
      </>
    );
  };

  const crumbs = (() => {
    const base = [{ t: 'Sociologia', click: goHome }];
    if (page === 'topic') {
      const t = topicById(topicId);
      const g = groupsData.find(x => x.id === t.parent);
      return [...base, ...(g ? [{ t: g.title }] : []), { t: t.title, current: true }];
    }
    if (page === 'quizzes') {
      return quizTopic
        ? [...base, { t: 'Quizes', click: () => setQuizTopic(null) }, { t: quizTitle(quizTopic), current: true }]
        : [...base, { t: 'Quizes', current: true }];
    }
    if (page === 'enem') {
      return enemQ
        ? [...base, { t: 'Banco ENEM', click: () => { setEnemQ(null); setEnemChoice(null); } }, { t: `Questão ${enemQ.volume}-${enemQ.number}`, current: true }]
        : [...base, { t: 'Banco ENEM', current: true }];
    }
    return base;
  })();

  const isTopic = page === 'topic';
  const topicObj = isTopic ? topicById(topicId) : null;

  return (
    <Toast.Provider swipeDirection="right" duration={3000}>
      <div className="flex h-screen">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-[#e4e4e7] bg-[#fafafa] md:flex">
          <NavPanel />
        </aside>

        <Dialog.Root open={navOpen} onOpenChange={setNavOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 md:hidden" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-72 bg-[#fafafa] shadow-xl focus:outline-none md:hidden">
              <Dialog.Title className="sr-only">Navegação de tópicos</Dialog.Title>
              <Dialog.Description className="sr-only">Lista de tópicos de sociologia</Dialog.Description>
              <NavPanel />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex items-center gap-3 border-b border-[#e4e4e7] bg-white px-4 py-4 md:px-6">
            <button onClick={() => setNavOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-md text-gray-700 hover:bg-black/[0.04] md:hidden" aria-label="Abrir menu de navegação">
              <Svg d={P.menu} size={20} />
            </button>
            <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
              <ol className="flex flex-wrap items-center gap-2 text-sm">
                {crumbs.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-gray-600" aria-hidden="true">/</span>}
                    {c.click
                      ? <button onClick={c.click} className="text-gray-500 hover:text-[#005bab] hover:underline">{c.t}</button>
                      : <span className={c.current ? 'font-semibold text-gray-900' : 'text-gray-500'} aria-current={c.current ? 'page' : undefined}>{c.t}</span>}
                  </li>
                ))}
              </ol>
            </nav>
          </header>

          <div className="flex-1 overflow-y-auto" ref={scrollRef}>
            {isTopic ? (
              <div key={'t-' + topicId} id="contentArea" className="content-main mx-auto max-w-4xl px-6 py-10 md:px-8 md:py-12" onClick={onToggleContent} dangerouslySetInnerHTML={{ __html: topicObj.content }} />
            ) : (
              <div key={'p-' + page} id="contentArea" className="content-main mx-auto max-w-4xl px-6 py-10 md:px-8 md:py-12">
                {page === 'home' && homeView}
                {page === 'quizzes' && quizzesView()}
                {page === 'enem' && (enemQ ? enemQuestionView() : enemPickerView)}
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="bg-[#02093a] py-12 text-white" role="contentinfo">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-bold">Sobre este Projeto</h3>
              <p className="mb-3 text-sm leading-relaxed text-gray-300">Portal educacional gratuito de Sociologia para o Ensino Médio, com conteúdo estruturado e 241 questões verificadas do ENEM.</p>
              <p className="text-xs text-gray-400">Criado por <strong>Gustavo Paccelli da Costa</strong></p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Licença</h3>
              <p className="mb-3 text-sm leading-relaxed text-gray-300">Conteúdo sob <strong>Creative Commons BY-NC-SA 4.0</strong>:</p>
              <p className="mb-4 text-xs text-gray-200">Compartilhe e remixe para fins educacionais<br />Não use para fins comerciais<br />Cite a autoria</p>
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#0075de] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005bab]" aria-label="Ver licença Creative Commons BY-NC-SA 4.0">Ver Licença Oficial</a>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Apoie este Projeto</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-300">Sua doação ajuda na manutenção e expansão deste recurso gratuito para estudantes.</p>
              <button onClick={() => setPixOpen(true)} className="rounded-md border border-[#62aef0] px-3 py-2 text-sm font-semibold text-[#62aef0] hover:bg-white/5">Apoiar via Pix</button>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-400">
            <p>
              © 2026 Repositório de Sociologia para o Ensino Médio |{' '}
              <a href="https://github.com/gustavopaccelli/sociologia-ensino-medio" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#62aef0]">GitHub</a> |{' '}
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#62aef0]">CC BY-NC-SA 4.0</a>
            </p>
          </div>
        </div>
      </footer>

      <Dialog.Root open={pixOpen} onOpenChange={setPixOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-8 shadow-lg focus:outline-none">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold text-gray-900">Doação via Pix</Dialog.Title>
              <Dialog.Close className="rounded-md p-1 text-gray-500 hover:text-gray-700" aria-label="Fechar modal de doação via Pix">
                <Svg d={P.x} size={20} />
              </Dialog.Close>
            </div>
            <Dialog.Description className="mb-6 text-sm text-gray-600">Pix é a forma mais rápida de contribuir para a manutenção deste projeto educacional.</Dialog.Description>
            <div className="mb-6 rounded-lg border-2 border-[#e4e4e7] bg-[#fafafa] p-6 text-center">
              <p className="mb-2 text-xs text-gray-500">Chave Pix</p>
              <p className="break-all font-mono text-sm font-bold text-gray-900">(32) 999973515</p>
            </div>
            <div className="mb-6 rounded-md border-l-4 border-[#0075de] bg-[#e6f3fe] p-4">
              <p className="text-xs text-gray-700"><strong>Dica:</strong> Copie a chave acima e use seu app do banco ou Pix para fazer a doação. Qualquer valor é bem-vindo!</p>
            </div>
            <Dialog.Close className="w-full rounded-md bg-[#f4f4f5] px-4 py-2 font-semibold text-[#02093a] hover:bg-[#e4e4e7]">Fechar</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={!!zoomSrc} onOpenChange={o => { if (!o) setZoomSrc(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-6 focus:outline-none" onClick={() => setZoomSrc(null)}>
            <Dialog.Title className="sr-only">Material de apoio ampliado</Dialog.Title>
            <Dialog.Description className="sr-only">Imagem ampliada da questão</Dialog.Description>
            {zoomSrc && <img src={zoomSrc} alt="Material de apoio ampliado" className="max-h-[90vh] max-w-[90vw] rounded-md bg-white" />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {toasts.map(t => (
        <Toast.Root key={t.id} duration={t.dur} onOpenChange={o => { if (!o) dismissToast(t.id); }}
          className={cn('flex items-center gap-2 rounded-md border p-4 text-sm font-medium shadow-md', toastStyle[t.type])}>
          <Toast.Description>{t.msg}</Toast.Description>
        </Toast.Root>
      ))}
      <Toast.Viewport className="fixed bottom-4 right-4 z-[100] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none" />
    </Toast.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
