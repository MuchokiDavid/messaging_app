#!/usr/bin/env python3

from flask import Flask, make_response, request, jsonify, abort, render_template, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from werkzeug.exceptions import NotFound
import hashlib
import uuid #Universal Unique Identifiers create random ID numbers for users.
import datetime
import jwt
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

from models import db, Message, Conversation, User

app = Flask(__name__)

app.config['SECRET_KEY']=  'dffa6aab40c946c5b6b43fb187791321'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///message.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)

db.init_app(app)
api= Api(app)

def token_required(func):
    @wraps(func)#allows us to add additional functionality to the decorated function
    def wrapper(*args, **kwargs):#*args (positinal arguments) and **kwargs(keyword arguments) allow us to pass any number of arguments to our function
        token= request.args.get('token')
        if not  token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'])
            # return func(payload)
        except jwt.ExpiredSignatureError:
             return jsonify({'message':'Signature expired! Login again.'}), 401
        except jwt.InvalidTokenError:
              return jsonify({'message':'Invalid Token!'}) , 401
    return wrapper

@app.errorhandler(NotFound)
def handle_not_found(e):
    response= make_response("NotFound: The requested resource not found", 404)
    return response

@app.route('/login', methods= ['POST'])
def login():
    auth= request.authorization
    if not auth or  not auth.username or not auth.password:
        return make_response('Could not verify your access', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    user= User.query.filter_by(username=auth.username).first()
    if not user or not check_password_hash(user._password_hash, auth.password):
        return make_response('Could not verify your account', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    if check_password_hash(user._password_hash, auth.password):
        token= jwt.encode({'public_id': user.public_id, 'exp' : datetime.datetime.utcnow()+ datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'], 'HS256')
        session['logged_in']= True
        return jsonify({'token' : token})

# @app.route('/login')
# def login():
#     auth = request.authorization

#     if not auth or not auth.username or not auth.password:
#         return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

#     user = User.query.filter_by(name=auth.username).first()

#     if not user:
#         return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

#     if check_password_hash(user._password_hash, auth.password):
#         token = jwt.encode({'public_id' : user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])

#         return jsonify({'token' : token.decode('UTF-8')})

#     return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

@app.route('/')
def index():
    if session.get('logged_in'):
        return render_template('index.html')
    else:
        return 'Please Log in'

class Messages(Resource):
    @token_required
    def get(self):
        all_messages= Message.query.all()
        result= [msg.serialize() for msg in all_messages]
        response= make_response(jsonify(result), 200)
        return response
    
    @token_required
    def post(self):
        data= request.get_json()
        content= data.get('content')
        conversation_id= data.get('conversation_id')
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
    @token_required
    def get(self, id):
        message= Message.query.get(id)
        if not message:
            response=  make_response(jsonify({'Error':'Message does not exist'}), 404)
            return response
        response=  make_response(jsonify(message.serialize()), 200)
        return response
    
    @token_required
    def delete(self, id):
        message = Message.query.get(id)
        if not message:
            response=  make_response(jsonify({'Error':'Message does not exist'}), 404)
            return response
        db.session.delete(message)
        db.session.commit()
        response = make_response(jsonify({"Message":"Deleted Successfully"}), 200)
        return response
    
    @token_required
    def patch(self, id):
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
    # @token_required
    def get(self):
        all_conversations= Conversation.query.all()
        if not all_conversations:
            response=  make_response(jsonify({'Error':'Conversations does not exist'}), 404)
            return response
        conversations_list= [conv.serialize() for conv in all_conversations]
        response=  make_response(jsonify(conversations_list),200)
        return response
    
    # @token_required
    def post(self):
        data= request.get_json()
        group= data.get('group_name')
        new_conversation=  Conversation(group_name=group)
        db.session.add(new_conversation)
        db.session.commit()
        response= make_response(jsonify(new_conversation.serialize()),201)
        return response
    
class ConversationById(Resource):
    @token_required
    def  get(self, id):
        conversation= Conversation.query.filter_by(id=id).first()
        if not conversation:
            response=  make_response(jsonify({'Error':'Conversations does not exist'}), 404)
            return response
        response=  make_response(jsonify(conversation.serialize()), 200)
        return response
    @token_required
    def delete(self, id):
        conversation= Conversation.query.filter_by(id=id).first()
        if not conversation:
            response=  make_response(jsonify({'Error':'Conversations does not exist'}), 404)
            return response
        db.session.delete(conversation)
        db.session.commit()
        response = make_response(jsonify({"Conversation":"Deleted Successfully"}), 200)
        return response
    
class UsersList(Resource):
    @token_required
    def get(self):
        users = User.query.all()
        return [{"id": user.id, "name": user.username, "email": user.email} for user in users]
    
    @token_required
    def post(self):
            # Function to hash the password using SHA-256
        def hash_password(password):
            hashed_password = generate_password_hash(password, method='sha256')
            return hashed_password
        
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('_password_hash')
        
        if not username or not email or not password:
            response = make_response(jsonify({"Error": "Username, email, and password are required fields"}), 400)
            return response
        
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            response = make_response(jsonify({"Error": "User with this email already exists"}), 400)
            return response
        
        password_hash = hash_password(password)
        
        new_user = User(username=username, public_id= str(uuid.uuid4()),email=email, _password_hash=password_hash)
        db.session.add(new_user)
        db.session.commit()
        
        response = make_response(jsonify(new_user.serialize()), 201)
        return response

class UsersByID(Resource):
    @token_required
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            return {"id": user.id, "name": user.username, "email": user.email}
        else:
            raise NotFound("User not found")
        
    @token_required    
    def delete(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'error':'User does not exist'},404
        else:
            db.session.delete(user)
            db.session.commit()
            response = make_response(jsonify({'Message':'User deleted'}), 200)
            return response
    @token_required    
    def patch(self, user_id):
        def hash_password(password):
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            return hashed_password
        existing_user = User.query.get(user_id)
        if not existing_user:
            return {'Error': 'User does not exist'}, 404

        data = request.get_json()
        if 'username' in data:
            existing_user.username = data['username']
        if 'email' in data:
            existing_user.email = data['email']
        if 'password' in data:
            password = data['password']

            # Hash the new password
            password_hash = hash_password(password)
            existing_user.password_hash = password_hash

        db.session.commit()
        response = make_response(jsonify(existing_user.serialize()), 200)
        return response



api.add_resource(Conversations, '/conversations')
api.add_resource(ConversationById, '/conversations/<int:id>')
api.add_resource(Messages, '/messages')
api.add_resource(MessageById, '/messages/<int:id>')
api.add_resource(UsersList, "/users")
api.add_resource(UsersByID, "/users/<int:user_id>")


if __name__ == '__main__':
    app.run(port=5555, debug= True)