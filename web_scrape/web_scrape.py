#!/usr/bin/python
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import json
import re
import operator

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





#output_file = sys.argv[1]
output_file = "clubs.json"
all_words_file = "tags.json"

#url = "https://mason360.gmu.edu/club_signup\?view\=all\&"
url = "http://localhost:8000/gmu-clubs.html"
#url = "http://localhost:8000/example.html"

raw_html = simple_get(url)
html = BeautifulSoup(raw_html, 'html.parser')

clubs = []
all_words = {}
words_to_ignore = ['and', 'the', 'to', 'of', 'in', 'a', 'is', 'for', 'mason', 'we', 'our', 'with', 'as', 'at', 'that', 'on', 'through', 'are', 'club', 'an', 'will', 'by', 'gmu', 'be', 'their', 'all', 'this', 'who', 'about', 'well', 'or', 'from', 'its', 'also', 'have', 'within', 'while', 'more', 'them', 'those', 'among', 'each', 'it', 'which', 'you', 'not', 's', 'can', 'want', 'out', 'but', 'they', 'non', 'both', 'any', 'into', 'such', 'where', 'every', 'has', 'come', 'these', 'was', 'get', 'become', 'like', 'amongst', 'us', 'take', 'so', 'most', 'e', '1', 'able', 'here', 'how', '3', '2', 'his', 'do', 'use', 'd', '4', 'no', 'c', 'if', '5', 'etc', 'u', 'eta', 'i', 'f', '6', '7', 'whose', 'https', 'my', 'r', 'k', 'put', 'yet', 'upon', "it's", 'end', 'ever', 'students', 'student', 'george', 'organization', 'university', 'mission', 'campus', 'members', 'association', 'provide', 'society', 'purpose', 'other']

def add_words(text):
    text = text.replace('\u00c1', '')
    text = text.replace('\u00e2', '')
    for word in re.findall(r"[\w']+", text):
        word = word.lower()
        if not len(word) < 2 and not word in words_to_ignore:
            if word in all_words:
                all_words[word] += 1
            else:
                all_words[word] = 1

print("Extracting group titles and website links...")
for a in html.select('li > div > div > div > div > h4 > a'):
    try:
        title = a.text.strip()
        url = a['href'].strip()
        clubs.append({'title': title, 'url':url})
        add_words(title)
    except KeyError:
        None

print("Extracting group descriptions...")
i = 0
for p in html.select('li > div > div > div > div > div'):
    try:
        for child in p.children:
            try:
                if child['id'][0:5] == "club_":
                    if child['id'][0:6] == "club_w":
                        None
                    else:
                        desc = p.text.strip()
                        desc = desc.split('\r\n\t\t\t\t\t\t\t\t', 1)
                        desc.append("")
                        desc.append("")
                        desc = desc[1]
                        desc = ' '.join(desc.split('\r\n\t\t\t\t\t\t\t\nMembership Benefits', 1))
                        desc = desc.replace('\u2022\t', ' ')
                        desc = desc.replace('\n\r\n\t\t\t\t\t\t\t\t\t', ' ')
                        clubs[i]['desc'] = desc
                        add_words(desc)
                        club_id = child['id'][5:]
                        clubs[i]['id'] = club_id
            except (AttributeError, KeyError, TypeError):
                None
        i += 1
    except (KeyError, IndexError):
        None

print("Extracting group images...")
i = 0
for img in html.select('li > div > div > div > div > a > img'):
    try:
        img = "https://mason360.gmu.edu"+img.attrs['src']
        clubs[i]['img'] = img
        #break
        i += 1
    except KeyError:
        None

print("Saving output to files...")
with open(output_file, 'w') as f:
    json.dump(clubs, f, indent=4)

with open(all_words_file, 'w') as f:
    json.dump(all_words, f, indent=4)

#sorted_words = sorted(all_words.items(), key=operator.itemgetter(1))
#for word in sorted_words:
#    print(word)
