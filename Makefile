# Makefile for httpd
#
DC=$(shell date +%y%m%d%H%M)
SEQ=20

package:
	cp ../UTILS/fs2xml opkg/usr/local/bin 
	tar czf release/$(SEQ)-httpd-$(DC).tgz -C opkg .
	@echo Created release/$(SEQ)-httpd-$(DC).tgz
	rm ../PACKAGES/$(SEQ)-httpd*
	cp release/$(SEQ)-httpd-$(DC).tgz ../PACKAGES/


