echo -e 'Good morning from service '"$SERVICE_NAME"' !\n'

echo "adding colors"
	source ./colors.sh
echo -e 'done.\n'

echo -e ${LLBLUE}${BOLD}'Installing sqlite'${CLEAN}
	apk add --no-cache sqlite
echo -e 'done.\n'

echo -e ${LBLUE}${BOLD}'checking sqlite version :'${CLEAN}
	echo -e -n ${LLYELLOW}'-> ' ; sqlite3 --version
echo -e ${LGREEN}${BOLD}' '${CLEAN}

echo -e ".headers on\n.mode column" > /root/.sqliterc

# Setting up database.db in /var/transcendence-database/
echo -e ${LORANGE}${BOLD}'moving from:'$(pwd)' to '"$PROJECT_CODE_DIRECTORY"${CLEAN}
cd $PROJECT_CODE_DIRECTORY

# Check for main.sql
if [ ! -f "main.sql" ]; then
	echo -e ${LORANGE}${BOLD}'Error: main.sql not found, Cannot initialize database.'${CLEAN}
    exit 1
fi

# Check for .db
if [ ! -f "database.db" ]; then
	echo -e ${LBLUE}${BOLD}'Database file not found, creating one...'${CLEAN}
    sqlite3 database.db -init main.sql
	echo -e ${LBLUE}${BOLD}'launched sql script at ['"$PROJECT_CODE_DIRECTORY"'/main.sql] :'${CLEAN}
else
	echo -e ${LLYELLOW}${BOLD}'Database file already exists.'${CLEAN}
fi

# Enable WAL mode
echo -e ${LBLUE}${BOLD}"Enabling WAL mode..."${CLEAN}
	sqlite3 database.db "PRAGMA journal_mode=WAL;"
echo -e ${LBLUE}${BOLD}"WAL mode enabled."${CLEAN}

#echo -e ${LLYELLOW}'Database file is READY".'${CLEAN}
# Keeping container alive, prevents files corruption
echo -e ${LLYELLOW}'Infinitely sleeping to keep database.db active FOR DEBUG.'${CLEAN}
	sleep infinite