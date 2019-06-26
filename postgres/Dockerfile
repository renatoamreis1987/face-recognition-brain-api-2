FROM postgres:12

# This is to create the folder and att the files
ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD /seed/ /docker-entrypoint-initdb.d/seed/

# This is to deploy the tables
ADD deploy_schemas.sql /docker-entrypoint-initdb.d/