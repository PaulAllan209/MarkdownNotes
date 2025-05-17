#!/bin/bash
set -e

echo "Starting docker-entrypoint.sh"

# Wait for SQL Server to be ready with more retries
for i in {1..5}; do
  echo "Attempt $i: Checking if SQL Server is ready..."
  if ./wait-for-it.sh sql-server:1433 -t 30; then
    echo "SQL Server is ready!"
    break
  fi
  
  if [ $i -eq 5 ]; then
    echo "SQL Server did not become available in time. Proceeding anyway..."
  else
    echo "SQL Server not ready yet. Waiting 10 more seconds..."
    sleep 10
  fi
done

# WORKAROUND: Add a sleep to give SQL Server more time to initialize
echo "Waiting additional 15 seconds for SQL Server to fully initialize..."
sleep 15

# Start the application
echo "Starting .NET application..."
exec dotnet markdown_note_taking_app.Server.dll