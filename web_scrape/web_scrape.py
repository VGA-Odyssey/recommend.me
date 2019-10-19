#!/usr/bin/python
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import json
import sys

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None.
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None

    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns True if the response seems to be HTML, False otherwise.
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200 
            and content_type is not None 
            and content_type.find('html') > -1)


def log_error(e):
    """
    It is always a good idea to log errors. 
    This function just prints them, but you can
    make it do anything.
    """
    print(e)










output_file = sys.argv[1]

url = "https://mason360.gmu.edu/club_signup\?view\=all\&"
url = "http://localhost:8000/gmu-clubs.html"
#url = "http://localhost:8000/example.html"

raw_html = simple_get(url)
html = BeautifulSoup(raw_html, 'html.parser')

clubs = []

print("Extracting group titles and website links...")
for a in html.select('h4 > a'):
    try:
        title = a.text.strip()
        url = a['href'].strip()
        clubs.append({'title': title, 'url':url})
        #break
    except KeyError:
        None

print("Extracting group descriptions...")
i = 0
for p in html.select('p'):
    try:
        if p['id'][0:5] == 'club_':
            #print(p)
            desc = p.text.strip()
            desc = desc.split('\r\n\t\t\t\t\t\t\t\t', 1)
            desc.append("")
            desc.append("")
            desc = desc[1]
            #print(len(clubs), i)
            clubs[i]['desc'] = desc
            #break
            i += 1
    except (KeyError, IndexError):
        None

print("Extracting group images...")
i = 0
for img in html.select('div > a > img'):
    try:
        img = "https://mason360.gmu.edu"+img.attrs['src']
        clubs[i]['img'] = img
        #break
        i += 1
    except KeyError:
        None

with open(output_file, 'w') as f:
    json.dump(clubs, f)
