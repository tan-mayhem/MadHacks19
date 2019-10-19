from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
async def root():
    return {"Message": "Hello!"}

@app.post("/user/{action}/{id}")
async def user(action: str="e", id: str):
    # check if user exists
    if action == "e":
        return 1
    elif action == "a":
        return -1

@app.get
