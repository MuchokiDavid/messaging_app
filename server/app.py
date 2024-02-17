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
    def get(id):
        message= Message.query.get(id)
        if not message:
            response=  make_response(jsonify({'Error':'Message does not exist'}), 404)
            return response
        response=  make_response(jsonify(message.serialize()), 200)
        return response
    
    def delete(id):
        message = Message.query.get(id)
        if not message:
            response=  make_response(jsonify({'Error':'Message does not exist'}), 404)
            return response
        db.session.delete(message)
        db.session.commit()
        response = make_response(jsonify({"Message":"Deleted Successfully"}), 200)
        return response
    
    def patch(id):
        message= Message.query.get(id)
        data= request.get_json()
        if not message:
            response=  make_response(jsonify({'Error':'Message does not exist'}), 404)
            return response
        content=  data.get('content')
        if content is None:
            return 'Missing content value', 400
        message.content= content
        db.session.commit()
        response= make_response(jsonify(message.serialize()), 200)
        return response
    
class Conversations(Resource):
    def get():
        all_conversations= Conversation.query.all()
        if not all_conversations:
            response=  make_response(jsonify({'Error':'Conversations does not exist'}), 404)
            return response
        conversations_list= [conv.serialize for conv in all_conversations]
        response=  make_response(jsonify(conversations_list, 200))
        return response
    
    def post():
        data= request.get_json()
        group= data['group']
        new_conversation=  Conversation(group_name=group)
        db.session.add(new_conversation)
        db.session.commit()
        response= make_response(jsonify(new_conversation.serialize(), 201))
        return response
    
api.add_resource(Conversations, '/conversations')
api.add_resource(Messages, '/messages')
api.add_resource(MessageById, '/messages/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug= True)