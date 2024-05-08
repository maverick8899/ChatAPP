echo '👋🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥CREATING APPLICATION USER AND DB🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥👋'

#* DB_HOST=db
#* DB_PORT=27017
#* DB_NAME=ChatAPP
#* DB_USER=chat
#* DB_PASSWORD=toisethanhcong08092003
#* MONGO_INITDB_ROOT_USERNAME=admin
#* MONGO_INITDB_ROOT_PASSWORD=admin

#? ${DB_NAME} sau mongosh là db được "use ${DB_NAME}" khi kết nối thành công vào
#? sau đó với tư cách root tạo user trong ${DB_NAME}
mongosh ${DB_NAME} \
    --host localhost \
    --port ${DB_PORT} \
    -u ${MONGO_INITDB_ROOT_USERNAME} \
    -p ${MONGO_INITDB_ROOT_PASSWORD} \
    --authenticationDatabase admin \
    --eval "db.createUser({user: '${DB_USER}', pwd: '${DB_PASSWORD}', roles:[{role:'dbOwner', db: '${DB_NAME}'}]});"

#? source ChatAPP.users.json in ChatAPP database
mongoimport --db ChatAPP --collection users --file /docker-entrypoint-initdb.d/ChatAPP.users.json --jsonArray -u chat -p toisethanhcong08092003 --authenticationDatabase ChatAPP

# mongosh ChatAPP -u admin -p admin --authenticationDatabase admin
# mongosh ChatAPP -u chat -p toisethanhcong08092003 --authenticationDatabase ChatAPP
