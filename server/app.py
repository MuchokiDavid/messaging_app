#!/usr/bin/env python3

from flask import Flask, make_response, request, jsonify
from flask_migrate import Migrate
from flask_restful import Api, Resource
from werkzeug.exceptions import NotFound

from models import db, Message, Conversation, User

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///message.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)

db.init_app(app)
api= Api(app)

@app.errorhandler(NotFound)
def handle_not_found(e):
    response= make_response("NotFound: The requested resource not found", 404)
    return response

@app.route('/')
def index():
    return '<h1>Messaging App</h1>'

class Messages(Resource):
    def get(self):
        all_messages= Message.query.all()
        result= [msg.serialize() for msg in all_messages]
        response= make_response(jsonify(result), 200)
        return response
    
    def post(self):
        data= request.get_json()
        content= data['content']
        conversation_id= data['conversation_id']
        checkCoversation= Conversation.query.get(conversation_id)
        if not checkCoversation:
            response= make_response(jsonify({"Error" : "Conversation not found"}), 400)
            return response
        new_message= Message(content= content, conversation_id= conversation_id)
        db.session.add(new_message)
        db.session.commit()
        response= make_response(jsonify(new_message.serialize()), 201)
        return response

class MessageById(Resource):
    pass

api.add_resource(Messages, '/messages')


if __name__ == '__main__':
    app.run(port=5555, debug= True)