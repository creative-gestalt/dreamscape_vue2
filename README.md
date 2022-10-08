# Dreamscape

## Installation

_prerequisites:_

- docker

You can run this on windows docker or linux. Linux is preferred.

_Linux_
```bash
~$ git clone <this-repo>
~$ cd dreamscape/
~/dreamscape$ touch .env
```

_Windows_
```
PS C:\Users\<you>\projects> git clone <this-repo>
PS C:\Users\<you>\projects\dreamscape> New-Item .env
```

## Environment

You'll need to add appropriate env variables before you build the container.<br />
Below are the keys you'll need. Set appropriate data according to your network / host.

```dotenv
# UI
FRONT_PORT=8080

# Server
SERVER_HOST=127.0.0.1 # <- must be the host's IP on your network, the application requests here via http
SERVER_PORT=3000

# Database
DB_ROOT_USER=root
DB_ROOT_PWD=root
DB_USER=dreamscape_user
DB_PWD=dreamscape_pwd
INIT_DB=dreamscape_db
DB_PORT=27017
```

## Build

_root dir_

```bash
~/dreamscape$ docker compose up -d --build
```

## Updating

If you change any `.env` variables, be sure to run `$ docker compose up -d --build`to force copying files into the
production containers.

- _this can take some time so be patient while it builds_
- _docker will cache portions of the build, making subsequent builds faster after the first build_

## Database

Connect via MongoDB Compass by placing the following values into the connection string:<br />

```
mongodb://{DB_USER}:{DB_PWD}@{SERVER_HOST}:{DB_PORT}/{INIT_DB}
```

ex: `mongodb://dreamscape_user:dreamscape_pwd@192.168.0.105:27017/dreamscape_db`

<br />If you want to view all collections, use the root user / pwd without a collection specified:

```
mongodb://{DB_ROOT_USER}:{DB_ROOT_PWD}@{SERVER_HOST}:{DB_PORT}/
```

ex: `mongodb://root:root@192.168.0.105:27017/`
