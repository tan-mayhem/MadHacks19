from time import time
import boto3
from boto3.dynamodb.conditions import Key, Attr, Not
from dotenv import load_dotenv
import os


load_dotenv()

#################
# base db class #
#################

class db:
    ''' subclass to handle db conn - throws errors '''

    def __init__(self):
        ''' get a dynamodb resource '''
        self.res = boto3.resource(
                        'dynamodb',
                        aws_access_key_id=os.environ.get('access'),
                        aws_secret_access_key=os.environ.get('secret'),
                        region_name='us-west-1'
                    )


    def getcli_(self):
        ''' quickly get a client to scan '''
        return boto3.client(
                        'dynamodb',
                        aws_access_key_id=os.environ.get('access'),
                        aws_secret_access_key=os.environ.get('secret'),
                        region_name='us-west-1'
                    )

    def create_(self, tid, key_schema, attribute_defn, **kw):
        ''' create table '''
        self.res.create_table(
            TableName=tid,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_defn,
            ProvisionedThroughput={
                "ReadCapacityUnits": kw.get('RCU', 2),
                "WriteCapacityUnits": kw.get('WCU', 2)
            }
        )

    def put_(self, tid, item):
        ''' put item(s) into table '''
        table = self.res.Table(tid)
        if not issubclass(type(item), list):
            item = [item]
        for i in item:
            table.put_item(Item=i)

    def query_(self, tid, keycondexpr):
        ''' lookup something in table '''
        table = self.res.Table(tid)
        resp = table.query(KeyConditionExpression=keycondexpr)
        return resp

    def delete_(self, tid, keytodelete):
        ''' delete something from table '''
        table = self.res.Table(tid)
        resp = table.delete_item(Key=keytodelete)
        return resp

    def scan_(self, tid, **kw):
        cli = self.getcli_()
        return cli.scan(TableName=tid, **kw)


######################
# class for ddb conn #
######################

class ddbconn(db):
    ''' class to handle connection to user db '''

    def __init__(self, tid, key_schema, attr_defn):
        db.__init__(self)
        self.tid = tid
        self.key_schema = key_schema
        self.attr_defn = attr_defn

    def create(self, **kw):
        ''' create table '''
        try:
            self.create_(
                self.tid,
                self.key_schema,
                self.attr_defn, **kw
            )
            return True
        except Exception as e:
            return {'error': str(e)}

    def put(self, item, **kw):
        ''' put item into table and handle errors '''
        try:
            self.put_(
                self.tid,
                item
            )
            return True
        except Exception as e:
            return {'error': str(e)}

    def query(self, keycondexpr, **kw):
        ''' look up item in table and handle errors '''
        try:
            resp = self.query_(self.tid, keycondexpr)
            return resp
        except Exception as e:
            return {'error': str(e)}

    def delete(self, keytodelete, **kw):
        ''' delete item from table and handle errors '''
        try:
            resp = self.delete_(self.tid, keytodelete)
            return resp
        except Exception as e:
            return {'error': str(e)}

    def scan(self, tid, **kw):
        try:
            return self.scan_(tid, **kw)
        except Exception as e:
            return {'error': str(e)}


######################
# how we track users #
######################

class userddbconn(ddbconn):
    ''' connect to user db '''

    def __init__(self):
        ''' define table name and schema, init connection '''
        self.tid = 'users-madhacks2019'    # name of table
        self.key_schema = [             # schema for keys
                    {
                        'AttributeName': 'username',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'password',
                        'KeyType': 'RANGE'
                    }
                ]
        self.attr_defn = [              # what types are our keys
                    {
                        'AttributeName': 'username',
                        'AttributeType': 'S'
                    },
                    {
                        'AttributeName': 'password',
                        'AttributeType': 'S'
                    }
                ]
        ddbconn.__init__(self, self.tid, self.key_schema, self.attr_defn)

    def hash__(self, x):
        ''' return hashed version of x '''
        return x

    def fmtentry__(self, **kw):
        '''
        clean up our input into a standard format
        args: username, password, email
        '''
        return {
            'username':    self.hash__(kw.get('username')),
            'password':    self.hash__(kw.get('password')),
            'phone':       self.hash__(kw.get('phone')),
            'forsale':     [],
            'signupdate':  str(int(time()))
        }

    def getUser(self, **kw):
        ''' get a user '''
        return self.query(Key('username').eq(kw.get('username')))

    def doesUserExist(self, **kw):
        '''
        is user in ddb?
        args: username, password
        '''
        u = self.getUser(**kw)
        if u.get('Count', -1) > 0:
            if u.get('Items')[0]['password'] == kw['password']:
                return {'Response': 1, 'meta': u.get('Items')[0]}
        return {'Response': 0}

    def signUpUser(self, **kw):
        '''
        add user to ddb
        args: username, password, email
        '''
        if self.doesUserExist(**kw)['Response'] == 0:
            p = self.put(self.fmtentry__(**kw))
            if p:
                return {'message': 'user signed up.',
                        'meta': {'newuname': kw.get('username')}}
            return {'message': 'failed to sign up user.',
                        'meta': p}
        return {'message': 'user already exists'}

    def logInUser(self, **kw):
        ''' if user exists, send them a cookie '''
        if self.doesUserExist(**kw)['Response'] == 1:
            return {'Result': 1, 'Cookie': 'COOKIE!!!'}
        else:
            return {'Result': 0, 'meta': {'message': 'User does not exist'}}

    def deleteUser(self, **kw):
        '''
        delete user from ddb
        args: username, password
        '''
        self.delete({
                    'username': kw.get('username'),
                    'password': kw.get('password')
                })
        return {'message': 'user deleted.'}

    def getUserCreds(self, **kw):
        ''' get username and password of user '''
        u = self.getUser(**kw)
        if u.get('Count', -1) > 0:
            u = u.get('Items', [{}])[0]
        return u.get('username', ''), u.get('password', '')


    def addSaleItemToUser(self, **kw):
        ''' add a sale item ID into user's `forsale` list '''
        uname, pword = self.getUserCreds(**kw)
        try:
            table = self.res.Table(self.tid)
            result = table.update_item(
                Key={
                    'username': uname,
                    'password': pword
                },
                UpdateExpression="SET forsale = list_append(forsale, :i)",
                ConditionExpression="NOT contains(forsale, :j)",
                ExpressionAttributeValues={
                    ':i': [kw.get('id_')],
                    ':j': kw.get('id_')
                },
                ReturnValues="UPDATED_NEW"
            )
            return {'Response': 1}
        except Exception as e:
            return {'Response': 0, 'Meta': {'Error': str(e)}}

##############################
# how we track land for sale #
##############################

class saleddbconn(ddbconn):
    ''' connect to sale db '''

    def __init__(self):
        ''' define table name and schema, init connection '''
        self.tid = 'sale-madhacks2019'    # name of table
        self.key_schema = [             # schema for keys
                    {
                        'AttributeName': 'id',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'seller',
                        'KeyType': 'RANGE'
                    }
                ]
        self.attr_defn = [              # what types are our keys
                    {
                        'AttributeName': 'id',
                        'AttributeType': 'S'
                    },
                    {
                        'AttributeName': 'seller',
                        'AttributeType': 'S'
                    }
                ]
        ddbconn.__init__(self, self.tid, self.key_schema, self.attr_defn)

    def fmtentry__(self, **kw):
        '''
        clean up our input into a standard format
        '''
        return {
            'id':        str(int(time())),
            'seller':    kw.get('seller'),
            'title':     kw.get('title'),
            'location':  kw.get('location'),
            'size':      kw.get('size'),
            'price':     kw.get('price'),
            'shortdesc': kw.get('shortdesc', ''),
            'longdesc':  kw.get('longdesc', '')
        }

    def addSaleItem(self, **kw):
        ''' add an item to our for sale db '''
        e = self.fmtentry__(**kw)
        p = self.put(e)
        if p:
            userddbconn().addSaleItemToUser(username=e['seller'], id_=e['id'])
            return {'Response': 1}
        return {'Response': 0}

    def scanForSale(self, **kw):
        ''' scan through the for sale db and return entries '''
        return self.scan(self.tid, **kw)