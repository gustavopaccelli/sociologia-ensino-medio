'use strict';
const fs = require('fs');
const path = require('path');

const INDEX_FILE = '/home/user/sociologia-ensino-medio/index.html';
const PESQUISA_DIR = '/home/user/sociologia-ensino-medio/docs/pesquisa';

// Read all PESQUISA files
const pesquisaFiles = fs.readdirSync(PESQUISA_DIR)
  .filter(f => f.startsWith('PESQUISA_P') && f.endsWith('.md'))
  .sort();

console.log(`Found ${pesquisaFiles.length} research files`);

// Topic ID to research topic mapping
const topicMap = {
  'individuo-sociedade': 'TÓPICO 1: INDIVÍDUO E SOCIEDADE',
  'sociologia-ciencia': 'TÓPICO 2: A SOCIOLOGIA COMO CIÊNCIA',
  'fundadores': 'TÓPICO 3: OS FUNDADORES DA SOCIOLOGIA',
  'cultura-sociedade': 'TÓPICO 4: CULTURA E SOCIEDADE',
  'populacoes-brasil': 'TÓPICO 5: POPULAÇÕES DO BRASIL',
  'sociedade-brasileira': 'TÓPICO 6: A SOCIEDADE BRASILEIRA',
  'diversidade-cultural-brasil': 'TÓPICO 7: DIVERSIDADE CULTURAL NO BRASIL',
  'cultura-arte-comunicacao': 'TÓPICO 8: CULTURA, ARTE E COMUNICAÇÃO',
  'religiao-sociedade': 'TÓPICO 9: RELIGIÃO E SOCIEDADE',
  'religioes-mundo-contemporaneo': 'TÓPICO 9.5: RELIGIÕES NO MUNDO CONTEMPORÂNEO',
  'raca': 'TÓPICO 10: RAÇA',
  'genero-sexualidade': 'TÓPICO 12: GÊNERO E SEXUALIDADE',
  'corporalidade-afetos': 'TÓPICO 13: CORPORALIDADE E AFETOS',
  'culturas-juvenis': 'TÓPICO 14: CULTURAS JUVENIS',
  'sistema-capitalista': 'TÓPICO 15: SISTEMA CAPITALISTA',
  'trabalho': 'TÓPICO 16: TRABALHO',
  'economia-sociedade-contemporanea': 'TÓPICO 17: ECONOMIA E SOCIEDADE CONTEMPORÂNEA',
  'classes-desigualdade': 'TÓPICO 18: CLASSES E DESIGUALDADE SOCIAL',
  'pobreza-brasil': 'TÓPICO 19: POBREZA E DESIGUALDADE NO BRASIL',
  'migracoes-deslocamentos': 'TÓPICO 20: MIGRAÇÕES E DESLOCAMENTOS HUMANOS',
  'estado-governo-democracia': 'TÓPICO 21: ESTADO, GOVERNO E DEMOCRACIA',
  'sistema-politico-brasileiro': 'TÓPICO 22: SISTEMA POLÍTICO BRASILEIRO',
  'formas-contemporaneas-mobilizacao': 'TÓPICO 23: FORMAS CONTEMPORÂNEAS DE MOBILIZAÇÃO',
  'sociabilidades-mundo-digital': 'TÓPICO 24: SOCIABILIDADES DO MUNDO DIGITAL',
  'ciencia-tecnologia': 'TÓPICO 25: CIÊNCIA E TECNOLOGIA',
  'consumo-estilos-vida': 'TÓPICO 26: CONSUMO E ESTILOS DE VIDA',
  'sociedade-meio-ambiente': 'TÓPICO 27: SOCIEDADE E MEIO AMBIENTE',
  'futuro': 'TÓPICO 28: FUTURO'
};

// Parse research files and extract topics
const allTopics = {};

pesquisaFiles.forEach(file => {
  const content = fs.readFileSync(path.join(PESQUISA_DIR, file), 'utf8');
  const lines = content.split('\n');

  let currentTopic = null;
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for topic headers
    if (line.startsWith('# 📌 TÓPICO')) {
      // Save previous topic
      if (currentTopic && currentContent.length > 0) {
        allTopics[currentTopic] = markdownToHtml(currentContent.join('\n'));
      }

      // Extract topic ID from line (e.g., "# 📌 TÓPICO 1: INDIVÍDUO E SOCIEDADE")
      const topicText = line.replace(/^# 📌 /, '');
      currentTopic = topicText;
      currentContent = [];
    } else if (currentTopic) {
      currentContent.push(line);
    }
  }

  // Save last topic
  if (currentTopic && currentContent.length > 0) {
    allTopics[currentTopic] = markdownToHtml(currentContent.join('\n'));
  }
});

console.log(`Extracted ${Object.keys(allTopics).length} topics from research`);

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => {
      // Headers
      if (line.startsWith('## ')) {
        return `<h3 class="text-xl font-bold mt-6 mb-3 text-gray-800">${line.replace('## ', '').replace(/^[🎯🔬👨‍🎓👤🌊⚼️✊👁️🫀🎤🏭📜⚠️💰🌍💕🌲🔮💪📜] /, '')}</h3>`;
      }
      if (line.startsWith('### ')) {
        return `<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-800">${line.replace('### ', '').replace(/^[⭐🔷📊✈️🎨🔄] /, '')}</h4>`;
      }

      // Bold emphasis
      if (line.includes('**')) {
        line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      }

      // Italics
      if (line.includes('_')) {
        line = line.replace(/_([^_]+)_/g, '<em>$1</em>');
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        return `<div class="callout info mb-4"><p class="text-gray-700">"${line.substring(2)}"</p></div>`;
      }

      // Regular paragraph
      if (line.trim()) {
        return `<p class="text-gray-700 mb-3">${line}</p>`;
      }
      return '';
    })
    .join('\n');

  return html;
}

// Match topics to index.html topics
let found = 0;
let notFound = [];

Object.entries(topicMap).forEach(([topicId, researchTopic]) => {
  if (allTopics[researchTopic]) {
    console.log(`✓ Found research for: ${topicId}`);
    found++;
  } else {
    notFound.push(topicId);
  }
});

console.log(`\n✓ Matched ${found} topics`);
if (notFound.length > 0) {
  console.log(`✗ Not found: ${notFound.join(', ')}`);
}

console.log('\nNext: Run integration with HTML template updates');
console.log('This script identifies topics. Next phase: update HTML content blocks.');
