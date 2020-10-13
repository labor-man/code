import os
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random

from models import setup_db, Question, Category

QUESTIONS_PER_PAGE = 10

def create_app(test_config=None):
  app = Flask(__name__)
  setup_db(app)
  cors = CORS(app, resources={r"*": {"origins": "*"}})

  @app.after_request
  def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
    return response


  @app.route('/categories')
  def get_categories():
    formatted_categories = [category.format() for category in Category.query.all()]

    categories_dict = {}
    for category in formatted_categories:
      categories_dict[category['id']] = category['type']

    return jsonify({
        'success':True,
        'categories':categories_dict
      })


  @app.route('/questions')
  def get_paginated_questions():
    page = request.args.get('page', 1, type=int)
    start = (page - 1)*QUESTIONS_PER_PAGE
    end = page*QUESTIONS_PER_PAGE

    formatted_questions = [question.format() for question in Question.query.all()]
    formatted_categories = [category.format() for category in Category.query.all()]

    categories_dict = {}
    for category in formatted_categories:
      categories_dict[category['id']] = category['type']

    questions = formatted_questions[start:end]
    if len(questions) == 0 and page != 1:
      abort(404)

    return jsonify({
        'success':True,
        'questions':questions,
        'total_questions':len(formatted_questions),
        'current_category':None,
        'categories':categories_dict
      })


  @app.route('/questions/<int:id>', methods=['DELETE'])
  def delete_question(id):
    question = Question.query.get(id)

    if question == None:
      abort(422)

    question.delete()

    page = page = request.args.get('page', 1, type=int)
    start = (page - 1)*QUESTIONS_PER_PAGE
    end = page*QUESTIONS_PER_PAGE
    formatted_questions = [question.format() for question in Question.query.all()]

    return jsonify({
        'success':True,
        'questions':formatted_questions[start:end],
        'deleted':question.id,
        'total_questions':len(formatted_questions)
      })


  @app.route('/questions', methods=['POST'])
  def create_question():
    data = request.json
    question = Question(question=data['question'], answer=data['answer'], difficulty=data['difficulty'], category=data['category'])
    question.insert()

    return jsonify({
        'success':True,
        'created':question.id
      })


  @app.route('/questions/search', methods=['POST'])
  def questions_search():
    page = 1
    start = (page - 1)*QUESTIONS_PER_PAGE
    end = page*QUESTIONS_PER_PAGE

    data = request.json
    query = Question.query.filter(Question.question.ilike('%{}%'.format(data['searchTerm'])))

    formatted_questions = [question.format() for question in query.all()]

    return jsonify({
        'success':True,
        'questions':formatted_questions[start:end],
        'total_questions':len(formatted_questions),
        'current_category':None
      })


  @app.route('/categories/<int:id>/questions')
  def get_questions_by_category(id):
    if Category.query.filter(Category.id==id).one_or_none() is None:
      abort(422)

    page = 1
    start = (page - 1)*QUESTIONS_PER_PAGE
    end = page*QUESTIONS_PER_PAGE

    questions = Question.query.filter(Question.category==id).all()

    formatted_questions = [question.format() for question in questions]

    return jsonify({
        'success':True,
        'questions':formatted_questions[start:end],
        'total_questions':len(formatted_questions),
        'current_category':id,
      })

  
  @app.route('/quizzes', methods=['POST'])
  def quiz():
    data = request.json

    quiz_category_id = data['quiz_category']['id']
    previous_question_ids = data.get('previous_questions', [])

    questions = Question.query.filter(Question.category == quiz_category_id).filter(Question.id.notin_(previous_question_ids)).all()
    
    question = None
    if len(questions):
      question = random.choice(questions).format()

    return jsonify({
        'success':True,
        'question':question
      })

  @app.errorhandler(404)
  def not_found(error):
      return jsonify({
          "success": False, 
          "error": 404,
          "message": "Not Found"
          }), 404

  @app.errorhandler(422)
  def unprocessable_entity(error):
      return jsonify({
          "success": False, 
          "error": 422,
          "message": "Unprocessable Entity"
          }), 422

  return app

    