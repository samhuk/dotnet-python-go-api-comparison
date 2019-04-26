from flask import Flask
from flask_restful import Api, Resource, reqparse
import logging
import random

users = [
    {
        "ID": 1,
        "Firstname": "Test",
        "Lastname": "User1",
        "Key": 0
    },
    {
        "ID": 2,
        "Firstname": "Test",
        "Lastname": "User2",
        "Key": 0
    },
    {
        "ID": 3,
        "Firstname": "Test",
        "Lastname": "User3",
        "Key": 0
    }
]

numUsers = 3

class Users(Resource):
    def get(self):
        for i in range(numUsers):
            users[i]['Key'] = random.random()
        return users

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

# Create the application instance
app = Flask(__name__)
api = Api(app)


api.add_resource(Users, "/users")

if __name__ == "__main__":
    app.run(port=5002, debug=False)