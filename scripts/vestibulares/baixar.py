#!/usr/bin/env python3
"""
Fase 1 — baixa os PDFs oficiais listados em data/fontes_pism.json.

Grava em data/pdfs/{sigla}/{ano}/ preservando o nome original do arquivo e gera
data/manifest.json com url_origem, sha256, data_download e bytes.

PDFs cujo ano da prova ainda não é conhecido (ano_prova=null na lista de fontes)
vão para .../sem-ano/ — a Fase 2 lê o ano da capa e o manifest é reescrito.

Uso:
    python3 scripts/vestibulares/baixar.py            # baixa o que falta
    python3 scripts/vestibulares/baixar.py --conferir # só confere sha256 do que já existe
"""
import json
import os
import sys
import hashlib
import datetime
import urllib.parse
import urllib.request
import urllib.error

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FONTES = os.path.join(RAIZ, 'data', 'fontes_pism.json')
PDFS = os.path.join(RAIZ, 'data', 'pdfs')
MANIFEST = os.path.join(RAIZ, 'data', 'manifest.json')

UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
LIMITE_SEM_PERGUNTAR = 50


def sha256(caminho):
    h = hashlib.sha256()
    with open(caminho, 'rb') as f:
        for bloco in iter(lambda: f.read(1 << 20), b''):
            h.update(bloco)
    return h.hexdigest()


def destino(sigla, item):
    nome = os.path.basename(urllib.parse.unquote(urllib.parse.urlparse(item['url']).path))
    ano = str(item.get('ano_prova') or 'sem-ano')
    return os.path.join(PDFS, sigla, ano, nome)


def baixar(url, caminho):
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        dados = r.read()
    if not dados.startswith(b'%PDF'):
        raise ValueError(f'resposta não é PDF (começa com {dados[:16]!r})')
    with open(caminho, 'wb') as f:
        f.write(dados)
    return len(dados)


def main():
    conferir = '--conferir' in sys.argv
    fontes = json.load(open(FONTES, encoding='utf-8'))
    sigla = fontes['instituicao']
    itens = fontes['pdfs']

    if len(itens) > LIMITE_SEM_PERGUNTAR:
        sys.exit(f'PARADA: {len(itens)} PDFs excedem o limite de {LIMITE_SEM_PERGUNTAR} '
                 f'por execução. Confirme antes de prosseguir.')

    manifest = {}
    if os.path.exists(MANIFEST):
        manifest = {m['url_origem']: m for m in json.load(open(MANIFEST, encoding='utf-8'))}

    ok = falhas = pulados = 0
    erros = []

    for item in itens:
        url = item['url']
        caminho = destino(sigla, item)
        rel = os.path.relpath(caminho, RAIZ)

        if os.path.exists(caminho):
            h = sha256(caminho)
            anterior = manifest.get(url, {}).get('sha256')
            if anterior and anterior != h:
                erros.append(f'{rel}: sha256 diverge do manifest')
                falhas += 1
            else:
                pulados += 1
                print(f'  = {rel}')
            manifest[url] = {
                'url_origem': url, 'arquivo': rel, 'sha256': h,
                'bytes': os.path.getsize(caminho),
                'data_download': manifest.get(url, {}).get('data_download'),
            }
            continue

        if conferir:
            pulados += 1
            continue

        try:
            n = baixar(url, caminho)
            manifest[url] = {
                'url_origem': url, 'arquivo': rel, 'sha256': sha256(caminho),
                'bytes': n,
                'data_download': datetime.datetime.now(datetime.timezone.utc)
                                 .isoformat(timespec='seconds'),
            }
            ok += 1
            print(f'  + {rel}  ({n:,} bytes)')
        except Exception as e:
            falhas += 1
            erros.append(f'{url}: {type(e).__name__}: {e}')
            print(f'  ! FALHA {url}\n      {type(e).__name__}: {e}')

    with open(MANIFEST, 'w', encoding='utf-8') as f:
        json.dump(sorted(manifest.values(), key=lambda m: m['arquivo']),
                  f, ensure_ascii=False, indent=2)

    print(f'\nbaixados {ok} | já presentes {pulados} | falhas {falhas}')
    print(f'manifest: {os.path.relpath(MANIFEST, RAIZ)} ({len(manifest)} entradas)')
    if erros:
        print('\nfalhas:')
        for e in erros:
            print(f'  - {e}')
        sys.exit(1)


if __name__ == '__main__':
    main()
