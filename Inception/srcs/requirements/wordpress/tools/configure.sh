#!/bin/sh
set -e

# Vérif Mariadb ready
timeout=30
echo "🔍 Attente de la disponibilité de MariaDB..."
while ! mariadb -h mariadb -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e ";" ; do
    sleep 1
    timeout=$((timeout - 1))
    if [ $timeout -eq 0 ]; then
        echo "⛔ Erreur : Impossible de se connecter à MariaDB."
        exit 1
    fi
done
echo "✅ MariaDB est disponible."

# WP-CLI
echo "📥 Téléchargement de WP-CLI..."
wget -q -O /usr/local/bin/wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x /usr/local/bin/wp-cli.phar

ln -sf /usr/local/bin/wp-cli.phar /usr/local/bin/wp

# WP-CLI fonctionne avant de continuer
if ! /usr/local/bin/wp --info --allow-root; then
    echo "⛔ Erreur : WP-CLI ne fonctionne pas correctement !"
    exit 1
fi

# WordPress est bien installé
if [ ! -f /var/www/html/index.php ]; then
    echo "📥 Téléchargement manuel de WordPress..."
    wget -q -O latest.tar.gz https://wordpress.org/latest.tar.gz
    tar -xzf latest.tar.gz
    mv wordpress/* /var/www/html/
    rm -rf wordpress latest.tar.gz
fi

# Supprimer wp-config.php mal formé
if [ -f /var/www/html/wp-config.php ]; then
    echo "⚠️ Suppression de l'ancien wp-config.php corrompu..."
    rm -f /var/www/html/wp-config.php
fi

# Vérifier que la base de données 
echo "🔍 Vérification de la base de données..."
if ! mariadb -h mariadb -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "USE $MYSQL_DATABASE"; then
    echo "⛔ Erreur : La base de données $MYSQL_DATABASE n'existe pas !"
    exit 1
fi
echo "✅ Base de données prête."

# Générer un nouveau wp-config.php propre en exécutant WP-CLI dans /var/www/html
echo "⚙️ Création d'un wp-config.php propre..."
cd /var/www/html/
/usr/local/bin/wp config create --allow-root \
    --dbname="$MYSQL_DATABASE" \
    --dbuser="$MYSQL_USER" \
    --dbpass="$MYSQL_PASSWORD" \
    --dbhost="mariadb" \
    --dbcharset="utf8" \
    --dbprefix="wp_"

# Vérifier si WordPress 
if ! /usr/local/bin/wp core is-installed --allow-root; then
    echo "🚀 Installation de WordPress..."
    /usr/local/bin/wp core install --allow-root \
        --url="$DOMAIN_NAME" \
        --title="Evan's Inception" \
        --admin_user="$WP_DB_USER" \
        --admin_password="$WP_DB_PASSWORD" \
        --admin_email="$WP_DB_EMAIL" \
        --skip-email
fi

# Correction des permissions 
echo "🔧 Réglage des permissions..."
# chown -R www-data:www-data /var/www/html/
find /var/www/html/ -type d -exec chmod 755 {} \;
find /var/www/html/ -type f -exec chmod 644 {} \;

# Démarrage PHP-FPM
echo "✅ Démarrage de PHP-FPM..."
exec php-fpm81 -F
