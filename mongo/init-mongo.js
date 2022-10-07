db = db.getSiblingDB(`${process.env.INIT_DB}`)

db.createUser({
    user: `${process.env.DB_USER}`,
    pwd: `${process.env.DB_PWD}`,
    roles: [
        {
            role: "readWrite",
            db: `${process.env.INIT_DB}`
        }
    ]
})

db.createCollection(`dreams-${process.env.APP_USER}`)
db.createCollection("sessions")
db.createCollection("settings")
