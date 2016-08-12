.PHONY: install deploy configure-test deploy-test

install:
	git remote add heroku https://git.heroku.com/nixon-groupme-test-bot.git
	npm install

deploy:
	git push heroku

configure-test:
	git remote add heroku-test https://git.heroku.com/commish-bot-test.git

deploy-test:
	git push heroku-test
