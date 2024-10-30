#!/bin/bash

echo "Starting MongoDB initialization script..."

# Wait for MongoDB to start
until mongo --port $MONGO_PORT --eval "print(\"Waiting for MongoDB connection...\")"; do
  sleep 1
done

# Authenticate and initiate the replica set
mongo --port $MONGO_PORT <<-EOJS
  print("Authenticating root user...");
  use admin;
  db.auth($MONGO_INITDB_ROOT_USERNAME, $MONGO_INITDB_ROOT_PASSWORD);

  print("Initializing replica set...");
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "db:$MONGO_PORT" }]
  });

  print("Replica set initiated.");
EOJS
echo "MongoDB initialization script completed."