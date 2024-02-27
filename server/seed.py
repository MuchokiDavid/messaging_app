from faker import Faker 
from models import db, User, Conversation, Message
from random import choice as rc
from flask_bcrypt import Bcrypt 
import uuid
fake =Faker()
bcrypt = Bcrypt()

from app import app

with app.app_context():
    User.query.delete()
    Conversation.query.delete()
    Message.query.delete()

    for  i in range(10):
        fake_password =fake.password(length=8)
        hashed_password =  bcrypt.generate_password_hash(fake_password).decode('utf-8')
        public_id = str(uuid.uuid4()) # Generate a unique identifier
        
        user =User(username=fake.user_name(), public_id= public_id,email=fake.free_email(), _password_hash =hashed_password)
        db.session.add(user)
        db.session.commit()


    for x in range (20):
        group_name= fake.company()
        conversations =Conversation(group_name=group_name)
        db.session.add(conversations)
        db.session.commit()


    for p in range (20):
        content = fake.sentence(nb_words =15)
        conversation_id = rc(Conversation.query.all()).id
        new_message= Message(content=content,conversation_id=conversation_id)
        db.session.add(new_message)
        db.session.commit()