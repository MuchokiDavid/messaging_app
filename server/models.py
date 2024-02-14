from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
import re
from sqlalchemy.ext.hybrid import hybrid_property

db = SQLAlchemy()

class UserConversation(db.Model, SerializerMixin):
    __tablename__= 'userconversations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id= db.Column(db.Integer, db.ForeignKey("users.id"))
    conversation_id= db.Column(db.Integer(), db.ForeignKey('conversations.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
class User(db.Model, SerializerMixin):
    __tablename__= 'users'

    id= db.Column(db.Integer, primary_key=True)
    username= db.Column(db.String(64), unique=True, nullable=False)
    email= db.Column(db.String(120), unique=True, nullable=False)
    password_hash= db.Column(db.String(128))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_conversations= db.relationship("UserConversation", backref="user")

    def __repr__(self):
        return f'<User {self.username}>'
    
    @validates('email')
    def validate_email(self, key, address):
        if not re.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", address):
            raise ValueError('Invalid Email Address')
        return address
    # Password getter and setter methods

class Conversation(db.Model, SerializerMixin):
    __tablename__= "conversations"

    id=  db.Column(db.Integer, primary_key= True)
    group_name= db.Column(db.String(), nullable= False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #rlshp
    messages= db.relationship("Message", backref= 'conversation')
    conversations_user= db.relationship("UserConversation", backref="conversation")

    def __repr__(self):
        return f'Conversation({self.group_name})'
    
class Message(db.Model, SerializerMixin):
    __tablename__= "messages"

    id=  db.Column(db.Integer, primary_key= True)
    content= db.Column(db.Text, nullable= False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    conversation_id= db.Column(db.Integer, db.ForeignKey("conversations.id"))

    def __repr__(self):
        return f'Message({self.content[:50]})'
        