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