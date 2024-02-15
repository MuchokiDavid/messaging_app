from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
import re
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt 

db = SQLAlchemy()
bcrypt = Bcrypt()

Usersconversation = db.Table(
    'usersconversations',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('conversation_id', db.Integer, db.ForeignKey('conversations.id'), primary_key=True),
)
    
class User(db.Model, SerializerMixin):
    __tablename__= 'users'

    id= db.Column(db.Integer, primary_key=True)
    username= db.Column(db.String(64), unique=True, nullable=False)
    email= db.Column(db.String(120), unique=True, nullable=False)
    _password_hash= db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    conversations= db.relationship('Conversation', secondary= Usersconversation, back_populates="users")
    
    @validates('email')
    def validate_email(self, key, address):
        if not re.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", address):
            raise ValueError('Invalid Email Address')
        return address
    
    # Password getter and setter methods
    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self.password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self.password_hash, password.encode('utf-8'))

    def serialize(self):
        return  {"id": self.id, "username": self.username,  "email": self.email }

class Conversation(db.Model, SerializerMixin):
    __tablename__= "conversations"

    id=  db.Column(db.Integer, primary_key= True)
    group_name= db.Column(db.String(), nullable= False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #rlshp
    messages= db.relationship("Message", backref= 'conversation')
    users= db.relationship('User', secondary= Usersconversation, back_populates = "conversations")

    def serialize(self):
        return {"id": self.id, "group_name": self.group_name}
    
class Message(db.Model, SerializerMixin):
    __tablename__= "messages"

    id=  db.Column(db.Integer, primary_key= True)
    content= db.Column(db.Text, nullable= False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    conversation_id= db.Column(db.Integer, db.ForeignKey("conversations.id"))

    def serialize(self):
        return {"id": self.id, "content": self.content, "created_at": self.created_at, "conversation_id": self.conversation_id}
        