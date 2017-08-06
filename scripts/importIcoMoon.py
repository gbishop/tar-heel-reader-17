#!/usr/bin/python3

'''Import icons from IcoMoon json format'''

import sys
import json
import textwrap

maxLen = 90

def camelCase(s):
    components = s.split('-')
    return components[0] + "".join(x.title() for x in components[1:])

inp = json.load(open('scripts/IcoMoon.json', 'r'));

print('export enum Icons {')
templ = "  {} =\n{},"
for icon in inp['icons']:
    tag = camelCase(icon['tags'][0])
    path = icon['paths'][0] # only works for a single path
    parts = iter(path.split(' '))
    line = "    '" + next(parts)
    lines = []
    for part in parts:
        if len(line) + 1 + len(part) > maxLen:
            lines.append(line + '\\')
            line = "     " + part
        else:
            line += ' ' + part

    lines.append(line + "'")
    path = '\n'.join(lines)
    print(templ.format(tag, path))
print('}')


