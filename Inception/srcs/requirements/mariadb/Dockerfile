FROM alpine:3.18

RUN apk update && apk add --no-cache mariadb mariadb-client

# Création du répertoire pour le socket Unix
RUN mkdir -p /run/mysqld && chown -R mysql:mysql /run/mysqld

# Copie de la configuration
COPY conf/my.cnf /etc/mysql/my.cnf

# Script d'initialisation
RUN mkdir -p /tmp/
COPY tools/init_db.sh tmp/init_db.sh

# VOLUME /var/lib/mysql
EXPOSE 3306

# CMD ["mysqld", "--user=mysql", "--console"]
CMD ["sh", "/tmp/init_db.sh"]