.PHONY: test-all check-names version-sync

test-all:
	cd go && go test ./...
	cd php && composer test
	cd node && npm test
	cd python && poetry run pytest

check-names:
	@echo "Detect vendor availability for npm / Packagist / PyPI"
	@echo "See .naming.md for outcome"

version-sync:
	@echo "Sync VERSION to language-specific version fields"
	@echo "Currently manual; wire up scripts/version-sync.sh in Phase B"
