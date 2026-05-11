#!/usr/bin/env python3
"""
figma-to-sd.py
Transforma JSON exportados desde Figma (Variables API format)
al formato Style Dictionary v4.

Lee:     ../../raw/{collection}.json   (~/vper-web/raw/)
Escribe: source/{collection}.json

Formatos soportados:
  - Figma Variables API: { id, name, modes, variables: [...] }
  - DTCG legacy:         { "collection": { modes: { "Mode 1": {...} } } }
  - Array DTCG:          [ { "collection": { modes: {...} } }, ... ]
"""

import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
RAW_DIR    = SCRIPT_DIR / 'source' / 'raw'
OUT_DIR    = SCRIPT_DIR / 'source'

COLLECTIONS = ['numbers', 'primitivos', 'semanticos', 'componentes']

TYPE_MAP = {
    'FLOAT':   'float',
    'STRING':  'string',
    'BOOLEAN': 'boolean',
    'COLOR':   'color',
}

FIGMA_META = {'$scopes', '$libraryName', '$collectionName'}


# ─── Color conversion ─────────────────────────────────────────────────────────

def rgba_to_css(r, g, b, a):
    """Convierte r/g/b/a (0–1) a string CSS preservando precisión completa."""
    R = round(r * 255)
    G = round(g * 255)
    B = round(b * 255)
    if a >= 1.0:
        return f'#{R:02x}{G:02x}{B:02x}'
    # Preservar hasta 4 decimales significativos, sin ceros finales
    a_str = f'{a:.4f}'.rstrip('0').rstrip('.')
    return f'rgba({R}, {G}, {B}, {a_str})'


def color_token(r, g, b, a):
    """
    Retorna { $type, $value } para un color.
    Colores con alpha < 1 usan $type: string para evitar que
    Style Dictionary pierda precisión en alphas pequeños.
    """
    css = rgba_to_css(r, g, b, a)
    typ = 'color' if a >= 1.0 else 'string'
    return {'$type': typ, '$value': css}


# ─── Nested dict builder ──────────────────────────────────────────────────────

def set_nested(d, path, value):
    """Inserta value en d siguiendo la lista de keys en path."""
    for key in path[:-1]:
        if key not in d or not isinstance(d[key], dict):
            d[key] = {}
        d = d[key]
    last = path[-1]
    if last in d and isinstance(d[last], dict) and '$value' not in d[last]:
        d[last].update(value)
    else:
        d[last] = value


def count_tokens(node):
    if not isinstance(node, dict):
        return 0
    if '$value' in node:
        return 1
    return sum(count_tokens(v) for v in node.values())


# ─── Parsers ──────────────────────────────────────────────────────────────────

def parse_raw_value(raw_val, vtype, res_by_mode, mode_id):
    """Convierte un valor concreto (no alias) a token SD."""
    if vtype == 'COLOR':
        if isinstance(raw_val, dict) and 'r' in raw_val:
            r, g, b, a = raw_val['r'], raw_val['g'], raw_val['b'], raw_val.get('a', 1.0)
        else:
            resolved = res_by_mode.get(mode_id, {}).get('resolvedValue', {})
            r = resolved.get('r', 0)
            g = resolved.get('g', 0)
            b = resolved.get('b', 0)
            a = resolved.get('a', 1.0)
        return color_token(r, g, b, a)

    if vtype == 'FLOAT':
        return {'$type': 'float', '$value': raw_val}

    if vtype == 'STRING':
        return {'$type': 'string', '$value': str(raw_val)}

    return {'$type': 'string', '$value': str(raw_val)}


def parse_figma_api(data):
    """
    Parsea el formato Figma Variables API:
    { id, name, modes: { modeId: modeName }, variables: [...] }
    """
    modes   = data['modes']
    mode_id = next(iter(modes))
    result  = {}

    for var in data['variables']:
        name        = var['name']          # "brand/main", "color/brand/red/600"
        vtype       = var['type']          # "FLOAT", "COLOR", "STRING"
        val_by_mode = var.get('valuesByMode', {})
        res_by_mode = var.get('resolvedValuesByMode', {})

        if mode_id not in val_by_mode:
            continue

        raw_val = val_by_mode[mode_id]

        if isinstance(raw_val, dict) and raw_val.get('type') == 'VARIABLE_ALIAS':
            # Token con alias → usar aliasName para construir la referencia SD
            resolved   = res_by_mode.get(mode_id, {})
            alias_name = resolved.get('aliasName', '')

            if alias_name:
                sd_ref = '{' + alias_name.replace('/', '.') + '}'
                sd_type = TYPE_MAP.get(vtype, 'string')
                # Para aliases de color con alpha, mantener $type según el valor resuelto
                if vtype == 'COLOR':
                    resolved_val = resolved.get('resolvedValue', {})
                    a = resolved_val.get('a', 1.0) if isinstance(resolved_val, dict) else 1.0
                    sd_type = 'color' if a >= 1.0 else 'string'
                token = {'$type': sd_type, '$value': sd_ref}
            else:
                # Sin aliasName disponible: resolver con el valor concreto
                token = parse_raw_value(raw_val, vtype, res_by_mode, mode_id)
        else:
            token = parse_raw_value(raw_val, vtype, res_by_mode, mode_id)

        path = name.split('/')
        set_nested(result, path, token)

    return result


def strip_meta(node):
    if not isinstance(node, dict):
        return node
    return {k: strip_meta(v) for k, v in node.items() if k not in FIGMA_META}


def parse_dtcg(data, name):
    """Parsea formato DTCG legacy (array o objeto con wrapper de colección)."""
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and name in item:
                data = item[name]
                break
        else:
            if data and isinstance(data[0], dict):
                data = next(iter(data[0].values()))

    if isinstance(data, dict):
        if name in data:
            data = data[name]
        if 'modes' in data:
            first_mode = next(iter(data['modes'].values()))
            return strip_meta(first_mode)

    return strip_meta(data)


def load_and_parse(path, name):
    """Detecta el formato y parsea el archivo raw."""
    with open(path, encoding='utf-8') as f:
        data = json.load(f)

    # Formato Figma Variables API
    if isinstance(data, dict) and 'variables' in data and 'modes' in data:
        return parse_figma_api(data)

    # Formato DTCG
    return parse_dtcg(data, name)


# ─── Transformaciones por colección ──────────────────────────────────────────

def transform_primitivos(tokens):
    """
    Renombra border → border-width para evitar colisión de namespace
    con la clave 'border' (colores semánticos) de semanticos.json.
    También añade spacing.7 = 28 que falta en el export de Figma
    (gap entre spacing/6=24 y spacing/8=32 en la escala de 4px).
    """
    if 'border' in tokens and 'border-width' not in tokens:
        tokens['border-width'] = tokens.pop('border')
    if 'spacing' in tokens and '7' not in tokens['spacing']:
        tokens['spacing']['7'] = {'$type': 'float', '$value': 28}
    return tokens


def transform_numbers(tokens):
    """
    Agrupa xs/sm/md/lg/xl/2xl/3xl/4xl bajo 'scale' para que no
    contaminen el namespace global de Style Dictionary.
    """
    SCALE_KEYS = {'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'}
    scale, rest = {}, {}
    for k, v in tokens.items():
        if k in SCALE_KEYS and isinstance(v, dict) and '$value' in v:
            scale[k] = v
        else:
            rest[k] = v
    if scale:
        rest['scale'] = scale
    return rest


def transform_semanticos(tokens):
    """
    Elimina focus.ring.color — genera el mismo CSS var que focus.ring-color
    (--focus-ring-color) causando una colisión de namespace en Style Dictionary.
    Se conserva focus.ring-color como fuente de verdad.
    """
    if 'focus' in tokens and 'ring' in tokens['focus']:
        tokens['focus']['ring'].pop('color', None)
    return tokens


TRANSFORMS = {
    'primitivos': transform_primitivos,
    'numbers':    transform_numbers,
    'semanticos': transform_semanticos,
}


# ─── Px units ─────────────────────────────────────────────────────────────────

def needs_px(path):
    """Returns True if a float token at this path should carry a px unit."""
    p, n = path, len(path)
    if n < 2:
        return False
    # spacing/*, radius/*, border-width/*
    if p[0] in ('spacing', 'radius', 'border-width'):
        return True
    # typography/size/*
    if n >= 3 and p[0] == 'typography' and p[1] == 'size':
        return True
    # button/text-size/*
    if n >= 3 and p[0] == 'button' and p[1] == 'text-size':
        return True
    # button/size/*/padding-x|padding-y
    if n >= 4 and p[0] == 'button' and p[1] == 'size' and p[3] in ('padding-x', 'padding-y'):
        return True
    # card/padding|radius  and  input/radius|padding-x|padding-y
    if p[0] == 'card'  and p[1] in ('padding', 'radius'):
        return True
    if p[0] == 'input' and p[1] in ('radius', 'padding-x', 'padding-y'):
        return True
    # pill/*/padding-x|padding-y
    if n >= 3 and p[0] == 'pill' and p[2] in ('padding-x', 'padding-y'):
        return True
    # layout/*/padding-x|padding-y|gap-x
    if n >= 3 and p[0] == 'layout' and p[2] in ('padding-x', 'padding-y', 'gap-x'):
        return True
    return False


def apply_px_units(node, path=None):
    """
    Recorre el árbol de tokens convirtiendo floats que necesitan unidad CSS.
      Valor concreto → $type: dimension, $value: "Npx"
      Alias          → $type: dimension, $value: "{ref}"  (evita mismatch de tipo)
    """
    if path is None:
        path = []
    if not isinstance(node, dict):
        return node
    if '$value' in node:
        if needs_px(path) and node.get('$type') == 'float':
            val = node['$value']
            if isinstance(val, (int, float)):
                return {'$type': 'dimension', '$value': f'{val:g}px'}
            if isinstance(val, str) and val.startswith('{'):
                return {'$type': 'dimension', '$value': val}
        return node
    return {k: apply_px_units(v, path + [k]) for k, v in node.items()}


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    if not RAW_DIR.exists():
        print(f'✗ No existe {RAW_DIR}')
        print('  Coloca los JSON exportados de Figma en esa carpeta.')
        sys.exit(1)

    print('Figma → Style Dictionary\n')

    # Cargar todos los archivos disponibles
    loaded = {}
    for name in COLLECTIONS:
        path = RAW_DIR / f'{name}.json'
        if not path.exists():
            continue
        try:
            tokens = load_and_parse(path, name)
            loaded[name] = tokens
        except Exception as e:
            print(f'✗ Error en {name}.json: {e}')
            sys.exit(1)

    if not loaded:
        print(f'✗ No se encontraron archivos en {RAW_DIR}')
        print(f'  Esperados: {", ".join(f"{n}.json" for n in COLLECTIONS)}')
        sys.exit(1)

    total_raw = sum(count_tokens(t) for t in loaded.values())
    print(f'✓ Mapa de IDs construido: {total_raw} variables\n')

    # Procesar y escribir
    grand_total = 0
    for name in COLLECTIONS:
        if name not in loaded:
            print(f'⚠  {RAW_DIR}/{name}.json no encontrado — saltando')
            continue

        tokens = loaded[name]

        if name in TRANSFORMS:
            tokens = TRANSFORMS[name](tokens)

        tokens = apply_px_units(tokens)

        n = count_tokens(tokens)
        grand_total += n

        out = OUT_DIR / f'{name}.json'
        with open(out, 'w', encoding='utf-8') as f:
            json.dump(tokens, f, indent=2, ensure_ascii=False)
            f.write('\n')

        print(f'✓ {name}.json → source/{name}.json ({n} tokens)')

    print(f'\n✓ Total: {grand_total} tokens procesados')
    print('  Ejecuta: npm run build')


if __name__ == '__main__':
    main()
