import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import setup_db, Question, Category


def assertHasAttr(self, obj, intendedAttr):
    testBool = intendedAttr in obj

    return self.assertTrue(testBool)

class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "trivia_test"
        self.database_path = "postgres://{}@{}/{}".format('fnsd:123456', 'localhost:5432', self.database_name)
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()
    
    def tearDown(self):
        """Executed after each test"""
        pass

    def test_get_categories(self):
        res = self.client().get('/categories')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

        assertHasAttr(self, data, 'categories')

    def test_get_paginated_questions(self):
        res = self.client().get('/questions')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

        assertHasAttr(self, data, 'questions')
        assertHasAttr(self, data, 'total_questions')
        assertHasAttr(self, data, 'current_category')
        assertHasAttr(self, data, 'categories')

    def test_delete_question(self):
        res = self.client().delete('/questions/9?page=1')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

        assertHasAttr(self, data, 'questions')
        assertHasAttr(self, data, 'deleted')

    def test_create_question(self):
        res = self.client().post('/questions', json={'question':'question1', 'answer':'answer1', 'difficulty':1, 'category':1})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

    def test_questions_search(self):
        res = self.client().post('/questions/search', json={'searchTerm':'movie'})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

        assertHasAttr(self, data, 'questions')
        assertHasAttr(self, data, 'total_questions')
        assertHasAttr(self, data, 'current_category')

    def test_get_questions_by_category(self):
        res = self.client().get('/categories/1/questions')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

        assertHasAttr(self, data, 'questions')
        assertHasAttr(self, data, 'total_questions')
        assertHasAttr(self, data, 'current_category')

    def test_quiz(self):
        res = self.client().post('/quizzes', json={'quiz_category':{'id':1, 'type':'Science'}, 'previous_questions':[]})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

        assertHasAttr(self, data, 'question')


    def test_404_sent_requesting_beyond_valid_page(self):
        res = self.client().get('/questions?page=100')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['error'], 404)  

    def test_422_sent_deleting_entity_not_exist(self):
        res = self.client().delete('/questions/1000')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 422)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['error'], 422)  



# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()