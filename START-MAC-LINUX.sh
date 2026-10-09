#!/usr/bin/env bash
cd "$(dirname "$0")/server"
echo "CampusConnect | Java backend + React frontend | http://localhost:8080"
(sleep 3; open http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null || true) &
java Server.java
