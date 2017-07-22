#!/usr/bin/python3

''' Translate strings for Tar Heel Reader '''

import argparse
import polib
import re
import os.path as osp
import requests
from apiclient.discovery import build

parser = argparse.ArgumentParser(description="Translate messages generate json file")
parser.add_argument('--po', help='Existing po file used first')
parser.add_argument('-u', help='update input file')
parser.add_argument('lang', help='Google language code')
parser.add_argument('messages', help='Json file of translated messages')
args = parser.parse_args()

print('args', args);


# read the existing po file if any
po = {}
if args.po:
    pof = polib.pofile(args.po)
    for entry in po:
        po[entry.msgid] = entry.msgstr

# extract strings from my Messages.ts file
msgpat = re.compile(r"\s+(\w+):\s*'(.*)',")
enMessages = []
for line in open('src/Messages.ts', 'r'):
    m = msgpat.match(line)
    if m:
        enMessages.append(m.groups())

# read the existing translations
old = {}
if osp.exists(args.messages):
    old = json.load(open(args.messages, 'r'))

def g_translate(message, lang):
    service = build('translate', 'v2', developerKey=API_KEY)
    request = service.translations().list(q=message, target=lang)
    response = request.execute()
    return response['translations'][0]['translatedText']

# Translate the ones we can't find elsewhere
new = {}
for key, message in enMessages:
    if key in old:
        new[key] = old[key]
    elif message in po:
        new[key] = po[message]
    else:
        new[key] = g_translate(message, args.lang)

