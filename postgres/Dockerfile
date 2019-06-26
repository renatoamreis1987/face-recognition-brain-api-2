FROM postgres:12

# This is to create the folder and att the files
ADD /tables/ /docker-entrypoint-initdb.d/tables/

# This is to deploy the tables
ADD deploy_schemas.sql /docker-entrypoint-initdb.d/