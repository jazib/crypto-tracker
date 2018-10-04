# Crypto Tracker
Crypto tracker to track prices from various exchanges using moneeda gateway API

### Disclaimer
- This repo uses boilerplate code from [ultimate-flask-front-end](https://github.com/realpython/ultimate-flask-front-end) , modified to use combination of webpack+babel upgrading the existing setup that was using gulp+bower.
- Also uses [grayscale](https://startbootstrap.com/template-overviews/grayscale/), a free bootstrap template for landing page.


### pre-reqs
- Node
- Python3

### How to setup

```bash
git clone https://github.com/jazib/crypto-tracker.git
cd crypto-tracker
npm install
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.sample .env

```
Make sure you add moneeda token in `.env` file once copied.
### How to run

```bash
npm run build
```
and in another window

```bash
sh run.sh
```

open localhost:5000