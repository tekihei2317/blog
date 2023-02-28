
#!/bin/bash

ARTICLE_PATH=articles/$(./scripts/generate-slug.sh)

touch $ARTICLE_PATH

echo "$ARTICLE_PATH created"
