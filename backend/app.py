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
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# define routes

@app.get("/test")
async def root():
    ''' to test if server is working '''
    return {"Message": "I'm working!"}

@app.get("/userexists")
async def userexists(req: Request):
    '''
    <h3>check if user exists</br>
    required
    <ul>
        <li>username</li>
        <li>password</li>
    </ul>
    </h3>
    '''
    req = await req.json()
    return udb.doesUserExist(**req)

@app.post("/adduser")
async def adduser(req: Request):
    '''
    <h3>add user</br>
    required
    <ul>
        <li>username</li>
        <li>password</li>
        <li>phone</li>
    </ul>
    </h3>
    '''
    req = await req.json()
    return udb.signUpUser(**req)

@app.post("/addforsale")
async def addforsale(req: Request):
    '''
    <h3>add land for sale</br>
    required params:
    <ul>
        <li>seller:     username of seller</li>
        <li>title:      title of post</li>
        <li>location:   street address of plot</li>
        <li>size:       size of land in acres</li>
        <li>price:      price of land per acre</li>
        <ul>
        optional params:
            <li>desc:   description of land/usage/etc</li>
        </ul>
    <ul>
    </h3>
    '''
    req = await req.json()
    return sdb.addSaleItem(**req)

@app.get("/forsale")
async def forsale(req: Request):
    '''
    <h3>See for sale postings
    optional params:
    <ul>
        <li>keywords: `*` delim'd string of keywords. searches union</li>
        <li>price:    max price per acre to search.</li>
        <li>To search by location:
        <ul>
            <li>loc:  street address</li>
            <li>rad:  radius in miles to search within</li>
        </ul>
        </li>
    </ul>
    </h3>
    '''
    req = await req.json()
    fs = sdb.scanForSale(**req)
    for i in fs.get('Items', [{}]):
        print(i)
