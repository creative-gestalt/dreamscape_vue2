set -e

mongo <<EOF
db = db.getSiblingDB("$INIT_DB")

db.createUser({
    user: "$DB_USER",
    pwd: "$DB_PWD",
    roles: [
        {
            role: "readWrite",
            db: "$INIT_DB"
        }
    ]
})

db.createCollection("dreams-$USER")
db.createCollection("sessions")
db.createCollection("settings")

EOF