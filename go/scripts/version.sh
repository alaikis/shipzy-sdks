#!/bin/bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <new-version>"
  echo "Example: $0 2.1.0"
  exit 1
fi

NEW_VERSION="$1"
VERSION_FILE="VERSION"

if [ ! -f "$VERSION_FILE" ]; then
  echo "Error: VERSION file not found"
  exit 1
fi

OLD_VERSION=$(cat "$VERSION_FILE")
echo "Bumping version: $OLD_VERSION → $NEW_VERSION"

echo "$NEW_VERSION" > "$VERSION_FILE"

# Update shared/version.go
sed -i.bak "s/const Version = \".*\"/const Version = \"$NEW_VERSION\"/" shared/version.go
rm -f shared/version.go.bak

# Update client.go
sed -i.bak "s/Version   = \".*\"/Version   = \"$NEW_VERSION\"/" client.go
rm -f client.go.bak

git add VERSION shared/version.go client.go
git commit -m "chore: bump version $OLD_VERSION → $NEW_VERSION"
git tag "v$NEW_VERSION"

echo "Version bumped and tagged: v$NEW_VERSION"