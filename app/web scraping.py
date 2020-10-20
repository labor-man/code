# libs: requests lxml bs4
import requests, bs4, os
print('Grabbing and save images from douban muti pages...')
dir = os.path.expanduser('~/Desktop/temp')
if not os.path.exists(dir):
	os.mkdir(dir)
os.chdir(dir)

# 应对豆瓣反爬，加上User-Agent Header
user_agent = "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:68.0) Gecko/20100101 Firefox/68.0"
r = requests.get('https://movie.douban.com/j/search_subjects?type=movie&tag=%E6%AC%A7%E7%BE%8E&sort=recommend&page_limit=1000&page_start=0', headers = {'User-Agent':user_agent})

for subject in r.json()['subjects']:
    image_link = requests.get(subject['cover'])
    print(subject['title'])
    with open(subject['title'].replace('/', u'\u2215') + os.path.splitext(subject['cover'])[1], 'wb') as f:
        f.write(image_link.content)
