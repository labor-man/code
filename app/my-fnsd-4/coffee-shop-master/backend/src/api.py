import os
from flask import Flask, request, jsonify, abort
from sqlalchemy import exc
import json
from flask_cors import CORS

from .database.models import db_drop_and_create_all, setup_db, Drink
from .auth.auth import AuthError, requires_auth

app = Flask(__name__)
setup_db(app)
CORS(app)

cors = CORS(app, resources={r"*": {"origins": "*"}})

'''
uncomment the following line to initialize the datbase
!! NOTE THIS WILL DROP ALL RECORDS AND START YOUR DB FROM SCRATCH
!! NOTE THIS MUST BE UNCOMMENTED ON FIRST RUN
'''
db_drop_and_create_all()

## ROUTES
@app.route('/drinks')
def get_drinks_short():
    drinks = [drink.short() for drink in Drink.query.all()]
    return jsonify({
            'success':True,
            'drinks':drinks
        })

@app.route('/drinks-detail')
@requires_auth(permission='get:drinks-detail')
def get_drinks_long(payload):
    drinks = [drink.long() for drink in Drink.query.all()]
    return jsonify({
            'success':True,
            'drinks':drinks
        })

@app.route('/drinks', methods=['POST'])
@requires_auth(permission='post:drinks')
def create_drink(payload):
    data = request.json
    drink = Drink(title=data['title'], recipe=json.dumps(data['recipe']))

    drink.insert()

    return jsonify({
            'success':True,
            'drinks':[drink.long()]
        })


@app.route('/drinks/<int:id>', methods=['PATCH'])
@requires_auth(permission='patch:drinks')
def patch_drink(payload, id):
    data = request.json
    drink = Drink.query.get(id)

    if drink is None:
        abort(404)

    for key in data:
        if key != 'id':
            setattr(drink, key, data[key])

    drink.update()

    return jsonify({
            'success':True,
            'drinks':[drink.long()]
        })


@app.route('/drinks/<int:id>', methods=['DELETE'])
@requires_auth(permission='delete:drinks')
def delete_drink(payload, id):
    drink = Drink.query.get(id)

    if drink is None:
        abort(404)

    drink.delete()

    return jsonify({
            'success':True,
            'delete':[drink.id]
        })

## Error Handling
@app.errorhandler(422)
def unprocessable(error):
    return jsonify({
                    "success": False, 
                    "error": 422,
                    "message": "Unprocessable"
                    }), 422

@app.errorhandler(404)
def unprocessable(error):
    return jsonify({
                    "success": False, 
                    "error": 404,
                    "message": "Not Found"
                    }), 404

@app.errorhandler(400)
def unprocessable(error):
    return jsonify({
                    "success": False, 
                    "error": 400,
                    "message": "Bad Request"
                    }), 400

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify({
            'error':ex.error,
            'description':ex.description,
            'code':ex.status_code
        })
    response.status_code = ex.status_code
    return response
