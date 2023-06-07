
#!/bin/bash

ARTICLE_PATH="articles/$(./scripts/generate-slug.sh).md"

touch $ARTICLE_PATH

echo "$ARTICLE_PATH created"
