#!/bin/sh
set -ex

mkdir -p /var/lib/mysql /run/mysqld
chown -R mysql:mysql /var/lib/mysql /run/mysqld

# Already exist
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initialisation de la base de données..."
    mysql_install_db --user=mysql --datadir=/var/lib/mysql
else
    echo "La base de données existe déjà, pas besoin d'initialisation."
fi

# temporary start
/usr/bin/mysqld_safe --datadir=/var/lib/mysql &

# wait 
echo "Attente de MariaDB..."
while ! /usr/bin/mysqladmin ping --silent; do
    sleep 2
done

echo "MariaDB est prêt, exécution des commandes SQL..."

# Config SQL with auth
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;
CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%' WITH GRANT OPTION;
ALTER USER 'root'@'localhost' IDENTIFIED BY '$MYSQL_ROOT_PASSWORD';
FLUSH PRIVILEGES;
EOF

echo "Config finish, stop MySQL."
mysqladmin -u root -p"$MYSQL_ROOT_PASSWORD" shutdown

# Restart MySQL
echo "Redémarrage de MySQL..."
exec /usr/bin/mysqld_safe --datadir=/var/lib/mysql
