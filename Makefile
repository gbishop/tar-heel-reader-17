deploy:
	npm run build
	rsync -a build/ gbserver3:/var/www/dev.tarheelreader

translate: 
	python3 scripts/Translate.py podir=../Theme/languages/ langs=de,fr,es,it,no,pt,tr msgdir=public/lang/
