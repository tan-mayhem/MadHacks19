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


##############
# USER STUFF #
##############

@app.get("/test")
async def root():
    ''' to test if server is working '''
    return {"Message": "I'm working!"}

@app.post("/userexists")
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
        <li>name</li>
    </ul>
    </h3>
    '''
    req = await req.json()
    return udb.signUpUser(**req)


##################
# FOR SALE STUFF #
##################

@app.post("/addforsale")
async def addforsale(req: Request):
    '''
    <h3>add land to for sale</br>
    required params:
    <ul>
        <li>seller:     username of seller</li>
        <li>title:      title of post</li>
        <li>location:   street address of plot</li>
        <li>size:       size of land in acres</li>
        <li>price:      price of land per acre</li>
        <li>phone:      contact info</li>
        <ul>
        optional params:
            <li>desc:   description of land/usage/etc</li>
            <li>imgurl: path to image</li>
        </ul>
    <ul>
    </h3>
    '''
    req = await req.json()
    return sdb.addSaleItem(**req)


@app.get("/forsale")
async def forsale(req: Request):
    '''
    <h3>See for sale postings</br>
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
    try:
        req = await req.json()
    except Exception as e:
        req = {}
    forsales = sdb.scanForSale(**req)
    for i, fs in enumerate(forsales):
        if isinstance(fs, dict):
            for k in list(fs):
                fs[k] = fs[k][list(fs[k])[0]]
        forsales[i] = fs
    return forsales

@app.post('/forsale/update')
async def forsaleupdate(req: Request):
    '''
    <h3>Add a bid</br>
    params:
    <ul>
        <li>id:     id of posting</li>
        <li>bidder: id of bidder</li>
        <li>bid:    new bid $$$</li>
    </ul>
    </h3>
    '''
    req = await req.json()
    sdb.updatePrice(red['id'], req['bidder'], req['bid'])
