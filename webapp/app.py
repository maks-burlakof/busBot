from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import PlainTextResponse

from clients.routeby_client import SiteParser

app = FastAPI()
app.mount('/static', StaticFiles(directory='webapp/public/static/'), name='static')

origins = [
    'http://localhost',
    '0.0.0.0',
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

templates = Jinja2Templates(directory='webapp/public/')
parser = SiteParser()


@app.get('/api/search')
def search_api(date: str, city_from: str, city_to: str):
    if not parser.get_cities().get(city_from) or not parser.get_cities().get(city_to):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Incorrect city provided')
    data = parser.api_parse(city_from, city_to, date)
    return {'results': data}


@app.get('/find')
def find(request: Request):
    context = {
        'request': request,
        'cities': parser.get_cities(),
    }
    return templates.TemplateResponse('find.html', context)


@app.get('/example')
def example(request: Request):
    return templates.TemplateResponse('example.html', {'request': request})


@app.get('/robots.txt', response_class=PlainTextResponse)
def robots():
    data = """User-agent: *\nDisallow: /"""
    return data
