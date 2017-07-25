deploy:
	npm run build
	rsync -a --delete-after build/ /var/www/THR

translate: 
	python3 scripts/Translate.py podir=../Theme/languages/ langs=de,fr,es,it,no,pt,tr msgdir=public/lang/
