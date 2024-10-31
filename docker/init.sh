#!/bin/bash
set -e

echo "Starting MongoDB initialization script..."

# Wait for MongoDB to start
until mongosh --port $MONGO_PORT --eval "print(\"Waiting for MongoDB connection...\")"; do
  sleep 10
done

# Authenticate and initiate the replica set
sleep 30
mongosh --port $MONGO_PORT <<EOF
  print("Authenticating root user...");
  use admin;
  db.auth("$MONGO_INITDB_ROOT_USERNAME", "$MONGO_INITDB_ROOT_PASSWORD");

  print("Initializing replica set...");
  rs.initiate({_id: "rs0", members: [{ _id: 0, host: "db:$MONGO_PORT" }]}, { force: true });

  print("Replica set initiated.");
EOF
echo "MongoDB initialization script completed."