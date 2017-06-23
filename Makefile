deploy:
	npm run build
	rsync -a --delete-after build/ /var/www/THR
