MSSG=""

if [ -z "$1" ] 
	then
		MSSG="Commit message"
	else
		MSSG=$1
fi

git add .
git commit -am "$MSSG"
git push origin HEAD

npm version patch
npm publish