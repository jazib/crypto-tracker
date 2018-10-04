from flask import Flask, render_template, jsonify, Response, request, abort
import requests
import json
import os
from dotenv import load_dotenv


app = Flask(__name__)

load_dotenv('.env')

token = os.environ.get('MONEEDA_AUTH_TOKEN')
if not token:
    raise ValueError('Need MONEEDA_AUTH_TOKEN in environment variable')

exchanges = os.environ.get('EXCHANGES')
if not exchanges:
    exchanges = ['BNB', 'BTX', 'BFX']
else:
    exchanges = exchanges.split(',')


headers = {'Authorization': 'Bearer {}'.format(token)}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/app')
def hello():
    return render_template('app.html')


@app.route('/api/v1.0/products', methods=['GET'])
def get_products():
    results = []
    for exchange in exchanges:
        result = requests.get("https://api.moneeda.com/api/exchanges/{}/products".format(exchange), headers=headers)
        if result.status_code == 200:
            results.append(result.json())

    if results:
        ids_list = [r['id'] for r in results[0]]
        flipped_res = set(ids_list)
        for result in results:
            ids_res = [r['id'] for r in result]
            flipped_res = flipped_res.intersection(ids_res)
        return Response(json.dumps(list(flipped_res)), mimetype='application/json')
    abort(404, "No data found from any exchange")


@app.route('/api/v1.0/products/<string:product>/prices', methods=['GET'])
def get_prices(product):
    if not product:
        abort(400, 'Need a valid product!')
    prices = []

    for exchange in exchanges:
        result = requests.get("https://api.moneeda.com/api/exchanges/{}/ticker?product={}".format(exchange, product), headers=headers)
        if result.status_code == 200:
            res = result.json()
            res['exchange'] = exchange
            prices.append(res)
        else:
            prices.append({'exchange': exchange, 'error': result.status_code, 'content': result.json()})
    return Response(json.dumps(prices))


if __name__ == '__main__':
    app.run(debug=True)

