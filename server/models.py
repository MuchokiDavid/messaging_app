from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
import re
from sqlalchemy.ext.hybrid import hybrid_property

db = SQLAlchemy()
