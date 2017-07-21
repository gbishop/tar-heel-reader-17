#!/usr/bin/python3
import sys
import re

opt = re.compile(r'<option\s*value="([^"]*)"\s*>([^<]+)')
lab = re.compile(r'<label[^>]+>([^<]+)')
plh = re.compile(r'placeholder="([^"]+)"')

res = []
proto = open('public/lang/proto.json', 'w')
js = open('/tmp/proto.js', 'w')
for fname in sys.argv[1:]:
    fp = open(fname, 'r')
    for line in fp:
        m = opt.search(line)
        nline = line
        if m:
            k, v = m.groups()
            if not k or len(k) < 2:
                k = v.split('/')[0].title().replace(' ', '')
            res.append((k, v.strip()))
            nline = line.replace('>%s<' % v, '>{M.%s}<' % k)
        m = lab.search(line)
        if m:
            k = v = m.group(1)
            k = k.title().replace(' ', '')
            res.append((k,v))
            nline = line.replace('>%s<' % v, '>{M.%s}<' % k)
        m = plh.search(line)
        if m:
            k = v = m.group(1)
            k = k.title().replace(' ', '')
            res.append((k,v))
            nline = line.replace('"%s"' % v, '{M.%s}' % k)
        sys.stdout.write(nline)
proto.write('{\n')
for k, v in res:
    proto.write('  "{}": "{}",\n'.format(k, v))
    js.write("  {}: '{}',\n".format(k, v))
proto.write('}\n')
