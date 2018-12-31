# Makefile for httpd
#
DC=$(shell date +%y%m%d%H%M)
SEQ=20


package:
	rm -Rf opkg/usr/local/*
	mkdir -p opkg/usr/local/init opkg/usr/local/bin opkg/usr/local/var/www opkg/etc
	cp -av init/* opkg/usr/local/init
	cp -av bin/* opkg/usr/local/bin
	cp -av www/* opkg/usr/local/var/www
	cp -av etc/* opkg/etc
	mkdir -p release
	tar czf release/$(SEQ)-httpd-$(DC).tgz -C opkg .
	@echo Created release/$(SEQ)-httpd-$(DC).tgz
	rm ../PACKAGES/$(SEQ)-httpd*
	cp release/$(SEQ)-httpd-$(DC).tgz ../PACKAGES/


