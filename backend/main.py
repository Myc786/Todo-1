from fastapi import FastAPI

app = FastAPI(title="Todo Web App API")

@app.get("/")
async def root():
    return {"message": "Todo Web App API is running"}
