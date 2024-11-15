from flask import Flask, jsonify, Response, request 
from webargs.flaskparser import use_args
from flask_sqlalchemy import SQLAlchemy, query
from marshmallow import Schema, fields , validate
from werkzeug.datastructures import ImmutableDict
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.config.from_pyfile('config.cfg')
db = SQLAlchemy(app)



# ================ERRORS 
class ErrorResponse:
    def __init__(self, message: str, http_status:int):
        self.payload = {
            'succes':False,
            'message': message
        }
        self.http_status = http_status

    def to_response(self) -> Response:
        response = jsonify(self.payload)
        response.status_code = self.http_status
        return response
        
@app.errorhandler(404)
def not_found_error(err):
    return ErrorResponse(err.description, 404).to_response()

@app.errorhandler(401)
def unauthorised_error(err):
    return ErrorResponse(err.description, 401).to_response()

@app.errorhandler(400)
def bad_request_error(err):
    messages = err.data.get('messages', {}).get('json',{})
    return ErrorResponse(messages, 400).to_response()

@app.errorhandler(415)
def unsuported_media_type_error(err):
    return ErrorResponse(err.description, 415).to_response()

@app.errorhandler(500)
def internal_server_error(err):
    db.session.rollback()
    return ErrorResponse(err.description, 500).to_response()
# ================ERRORS 

class Transport(db.Model):
    __tablename__ = 'transport'
    id = db.Column(db. Integer, primary_key=True, autoincrement=True)
    transport_date = db. Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    transport_time = db.Column(db.Time, nullable=False) 
    starting_place = db.Column(db.String(50), nullable=False)
    destination = db.Column(db.String(50), nullable=False)
    additional_information = db.Column(db.String(50))



    def __repr__(self):
        return 'Obj: {} - {}'.format(self.id, self.name)
    
    @staticmethod
    def get_schema_args(fields:str) -> dict:
        schema_args = {'many':True}
        if fields:
            schema_args['only'] = [field for field in fields.split(',') if field in Transport.__table__.columns]
        return schema_args
    
    @staticmethod
    def apply_order(query: query, sort_keys: str) -> query:
        if sort_keys:
            for key in sort_keys.split(','):
                desc = False
                if key.startswith('-'):
                    key = key[1:]
                    desc = True
                column_attr = getattr(Transport, key, None)
                if column_attr is not None:
                     query = query.order_by(column_attr.desc()) if desc else query.order_by(column_attr)
        return query
    
    @staticmethod
    def apply_filter(query: query, params:ImmutableDict) -> query:
        for param, value in params.items():
            if param not in {'fields', 'sort'}:
                column_attr = getattr(Transport, param, None)
                if column_attr is not None:
                    query = query.filter(column_attr == value)
        return query


class TransportSchema(Schema):
    id = fields.Integer(dump_only=True)
    transport_date = fields.Date('%d-%m-%Y',required=True)
    time = fields.Time(required=True)
    transport_time = fields.Time(required=True)
    starting_place = fields.String(required=True, validate=validate.Length(max=50))
    destination = fields.String(required=True, validate=validate.Length(max=50))
    additional_information = fields.String(required=False,validate=validate.Length(max=50))


transport_schema = TransportSchema()

@app.route('/transports' , methods=['GET'])
def get_transports():
    query = Transport.query
    schema_args= Transport.get_schema_args(request.args.get('fields'))
    query = Transport.apply_order(query, request.args.get('sort'))
    query = Transport.apply_filter(query, request.args)
    transports = query.all()
    transport_schema = TransportSchema(**schema_args)
    return jsonify({
        'succes': True,
        'data': transport_schema.dump(transports)
    })

@app.route('/transports/<int:transport_id>', methods=['GET'])
def get_transport(transport_id:int):
    transport = Transport.query.get_or_404(transport_id, description=f'Nie istnieje obiekt z takim id')
    return jsonify({
        'succes': True,
        'data': transport_schema.dump(transport)
    })


@app.route('/transports', methods=['POST'])
@use_args(transport_schema, error_status_code=400)
def create_transport(args:dict):
    transport = Transport(**args)
    db.session.add(transport)
    db.session.commit()
    return jsonify({
        'succes': True,
        'data': transport_schema.dump(transport)
    }), 201

@app.route('/transports/<int:transport_id>', methods=['PUT'])
@use_args(transport_schema, error_status_code=400)
def update_transport(args: dict, transport_id:int):
    transport = Transport.query.get_or_404(transport_id, description=f'Nie istnieje obiekt z takim id')
    
    transport.transport_date = args['transport_date']
    transport.time = args['time']
    transport.transport_time = args['transport_time']
    transport.starting_place = args['starting_place']
    transport.destination = args['destination']
    transport.additional_information = args['additional_information']
    db.session.commit()

    return jsonify({
        'succes': True,
        'data': transport_schema.dump(transport)
    })

@app.route('/transports/<int:transport_id>', methods=['DELETE'])
def delete_transport(transport_id:int):
    transport = Transport.query.get_or_404(transport_id, description=f'Nie istnieje obiekt z takim id')
    db.session.delete(transport)
    db.session.commit()
    return jsonify({
        'succes': True,
        'data': f'Transport o adresie id {transport_id} został usunięty'
    })