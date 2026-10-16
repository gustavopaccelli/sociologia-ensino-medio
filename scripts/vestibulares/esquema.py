#!/usr/bin/env python3
"""
Cria data/staging.db — a área de staging da Fase 2.

O schema estende o de enem_questions.json: os campos herdados têm o mesmo nome e
o mesmo significado, para que a Fase 4 possa exportar um array compatível com o
banco do ENEM apenas acrescentando as colunas novas.

Campos JSON (blocks, options, images, topicos) ficam como TEXT serializado —
SQLite não tem tipo próprio e a Fase 4 desserializa na saída.
"""
import sqlite3
import os

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB = os.path.join(RAIZ, 'data', 'staging.db')

SCHEMA = """
CREATE TABLE IF NOT EXISTS questoes (
    -- herdados de enem_questions.json
    id                  TEXT PRIMARY KEY,
    number              TEXT,
    tema                TEXT,
    blocks              TEXT NOT NULL,   -- JSON [{type,text|src}]
    enunciado           TEXT,
    options             TEXT,            -- JSON {A..E}; NULL em discursivas
    images              TEXT NOT NULL DEFAULT '[]',
    topicos             TEXT NOT NULL DEFAULT '[]',
    correctAnswer       TEXT,            -- só de gabarito oficial
    justificativa       TEXT,
    nivel               TEXT,

    -- novos
    instituicao         TEXT NOT NULL,
    programa            TEXT NOT NULL,
    etapa               INTEGER,
    ano_prova           INTEGER,
    dia                 TEXT,
    area_curso          TEXT,
    tipo                TEXT NOT NULL CHECK (tipo IN ('objetiva','discursiva')),
    disciplina_origem   TEXT,
    relacao_sociologia  TEXT CHECK (relacao_sociologia IN ('autonoma','diluida','interface')),
    expectativa_resposta TEXT,           -- só de espelho/referência oficial
    fonte_url           TEXT NOT NULL,
    fonte_pdf_local     TEXT,
    pagina              INTEGER,

    status              TEXT NOT NULL CHECK (status IN ('aprovada','pendente_revisao')),
    needs_review        INTEGER NOT NULL DEFAULT 0,
    ocr_necessario      INTEGER NOT NULL DEFAULT 0,

    -- trilha de auditoria: por que a questão caiu em pendente_revisao
    motivo_pendencia    TEXT,
    extraido_em         TEXT
);

CREATE INDEX IF NOT EXISTS ix_status  ON questoes(status);
CREATE INDEX IF NOT EXISTS ix_origem  ON questoes(instituicao, programa, etapa, ano_prova);
CREATE INDEX IF NOT EXISTS ix_relacao ON questoes(relacao_sociologia);
"""


def conectar():
    os.makedirs(os.path.dirname(DB), exist_ok=True)
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    con.executescript(SCHEMA)
    return con


if __name__ == '__main__':
    con = conectar()
    cols = [r[1] for r in con.execute("PRAGMA table_info(questoes)")]
    print(f'{DB}')
    print(f'  tabela questoes: {len(cols)} colunas')
    print(f'  linhas: {con.execute("SELECT count(*) FROM questoes").fetchone()[0]}')
    con.close()
