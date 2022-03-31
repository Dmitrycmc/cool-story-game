if [[ `git status --porcelain` ]]; then
  echo "You have uncommited changes"
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
  echo Новая версия спешит на https://cool-story-game.herokuapp.com/
fi