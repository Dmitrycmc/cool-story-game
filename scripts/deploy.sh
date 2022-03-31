GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

if [[ `git status --porcelain` ]]; then
  echo "Есть ${RED}несохраненные${NC} изменения"
else
  npm run build --prefix=web-app && \
  npm version patch && \

  git checkout build && \
  git reset --hard master && \
  mv web-app/dist web-app/build && \

  git add . && \
  git commit -m build && \
  git push -f && \

  git checkout master && \
  echo ${GREEN}Новая версия${NC} спешит на https://cool-story-game.herokuapp.com/
fi