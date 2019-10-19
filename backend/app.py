from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
import ddb


# setup ddb
udb = ddb.userddbconn()
udb.create()
sdb = ddb.saleddbconn()
sdb.create()


#######
# API #
#######

# setup fastapi app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# define routes

@app.get("/test")
async def root():
    ''' to test if server is working '''
    return {"Message": "I'm working!"}

@app.post("/userexists")
async def userexists(req: Request):
    '''
    <h3>check if user exists\n
    required: `username` and `password`</h3>
    '''
    req = await req.body()
    req = req.decode('utf-8')
    req = {k.split('=')[0]:k.split('=')[1] for k in req.split('&')}
    return udb.doesUserExist(**req)

@app.post("/adduser")
async def adduser(req: Request):
    '''
    <h3>add user\n
    required: `username`, `password`, `phone`</h3>
    '''
    req = await req.body()
    req = req.decode('utf-8')
    req = {k.split('=')[0]:k.split('=')[1] for k in req.split('&')}
    return udb.signUpUser(**req)

@app.post("/addforsale")
async def addlandforsale(req: Request):
    '''
    <h3>add land for sale\n
    required params:
        - `seller`:     username of seller
        - `title`:      title of post
        - `location`:   street address of plot
        - `size`:       size of land in acres
        - `price`:      price of land per acre
    optional params:
        - `shortdesc`:  short description of land/usage/etc
        - `longdesc`:   longer description</h3>
    '''
    req = await req.body()
    req = req.decode('utf-8')
    req = {k:v for k,v in map(lambda x: x.split('='), req.split('&'))}
    return sdb.addSaleItem(**req)

@app.get("/forsale")
async def forsale(req: Request):
    '''
    <h3>See for sale postings\n
    optional params:
        - `keywords`: delim'd string of keywords. searches union
        - `price`:    max price per acre to search
        - to search by location:
            - `loc`:  street address
            - `rad`:  radius in miles to search within</h3>
    '''
