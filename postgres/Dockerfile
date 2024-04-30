FROM postgres
COPY ./init_db.sh /docker-entrypoint-initdb.d/init_db.sh
CMD ["docker-entrypoint.sh", "postgres"]