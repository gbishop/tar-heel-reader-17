#!/usr/bin/python3
# coding: utf-8

# # Translate Messages for THR 17
# 
# Read the messages from src/Messages.ts and make sure they each have a translation into
# the requested target language.
# 
# I give preference first to the original contents, then to the given `po` file assuming
# a human did the work to create it, and finally to Google Translate.
# 
# The idea is to create a new project on Transifex to get humans to help but to use the
# old THR translations and Google until then.

import Args # my args module
import polib
import re
import os.path as osp
import requests
import json
from apiclient.discovery import build


args = Args.Parse(
    podir='',                   # path to dir with po files
    src='src/Messages.ts',      # where to find the needed strings
    langs=str,                  # comma separataed list of 2-letter iso language codes
    msgdir=str,                 # directory for the json files for translations
    key=str,                    # Google API key
    _config='scripts/translatekey.json'
)

# extract strings from my Messages.ts file
msgpat = re.compile(r"\s+(\w+):\s*'(.*)',")
enMessages = []
for line in open(args.src, 'r'):
    m = msgpat.match(line)
    if m:
        enMessages.append(m.groups())

API_KEY=args.key
def g_translate(message, lang):
    service = build('translate', 'v2', developerKey=API_KEY)
    request = service.translations().list(q=message, target=lang)
    response = request.execute()
    return response['translations'][0]['translatedText']

locales = { 'en': 'English' }

# for each language in the list
for lang in args.langs.split(','):

    # read the existing po file if any
    po = {}
    if args.podir:
        pof = polib.pofile(osp.join(args.podir, lang + '.po'))
        for entry in pof:
            po[entry.msgid] = entry.msgstr

    # read the existing translations
    old = {}
    jpath = osp.join(args.msgdir, lang + '.json')
    if osp.exists(jpath):
        old = json.load(open(jpath, 'r'))

    # Translate the ones we can't find elsewhere
    new = {}
    for key, message in enMessages:
        if key in old:
            new[key] = old[key]
        elif message in po:
            new[key] = po[message]
        else:
            new[key] = g_translate(message, args.lang)
            print(key, new[key])

    # get the native name for the locales
    locales[lang] = new[lang]

    json.dump(obj=new, fp=open(jpath, 'w'), indent=2, sort_keys=True)

json.dump(obj=locales, fp=open('src/locales.json', 'w'), indent=2, sort_keys=True)
