# nginx is capable of ssl
# example: copy ./mnt/local/nginx/* uut:/mnt/local/nginx
# https: now "works" with the usual "Not secure" caveats
# for a robust local implementation, please set up your own certificate authority.

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout ./mnt/local/nginx/nginx-selfsigned.key \
	-out ./mnt/local/nginx/nginx-selfsigned.crt


