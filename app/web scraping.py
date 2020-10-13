# libs: requests lxml bs4

# Grabbing a title

import requests, bs4
url = input('输入一个完整网址，抓取标题:')
try:
	result = requests.get(url)
	soup = bs4.BeautifulSoup(result.text, 'lxml')
	first_title = soup.select('title')[0].getText()
	print(f'first title:{first_title}')
except:
	print('出现了错误：）')


# Grabbing a class
import requests, bs4
try:
	result = requests.get('https://zh.wikipedia.org/wiki/2019%E5%86%A0%E7%8A%B6%E7%97%85%E6%AF%92%E7%97%85')
	soup = bs4.BeautifulSoup(result.text, 'lxml')
	els = soup.select('.reference-text')
	for el in els:
		print(el.text)
except:
	print('出现了错误：）')


# Grabbing from muti pages
print('Grabbing from muti pages...')
import requests, bs4
authors = set()
base_url = 'http://quotes.toscrape.com/page/{}/'
page_num = 1
while True:
    url = base_url.format(page_num)
    response = requests.get(url)
    
    soup = bs4.BeautifulSoup(response.text, 'lxml')
    authorEls = soup.select('.author')
    
    if len(authorEls) != 0:
        authors = authors | {authorEl.getText() for authorEl in authorEls}
    else:
        break
        
    page_num += 1

print('authors:')   
print(authors)

# Grabbing from muti pages
print('Grabbing from muti pages...')
import requests, bs4, os, send2trash

# 应对豆瓣反爬，加上User-Agent Header
user_agent = "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:68.0) Gecko/20100101 Firefox/68.0"
r = requests.get('https://movie.douban.com/j/search_subjects?type=movie&tag=%E6%AC%A7%E7%BE%8E&sort=recommend&page_limit=1000&page_start=0', headers = {'User-Agent':user_agent})

dir = os.path.expanduser('~/Desktop/temp')
if os.path.exists(dir):
	send2trash.send2trash(dir)

os.mkdir(dir)
os.chdir(dir)
for subject in r.json()['subjects']:
    image_link = requests.get(subject['cover'])
    print(subject['title'])
    with open(subject['title'].replace('/', u'\u2215') + os.path.splitext(subject['cover'])[1], 'wb') as f:
        f.write(image_link.content)