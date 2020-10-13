# libs: requests lxml bs4

import os, requests, bs4
result = requests.get('https://zh.wikipedia.org/wiki/2019%E5%86%A0%E7%8A%B6%E7%97%85%E6%AF%92%E7%97%85')
soup = bs4.BeautifulSoup(result.text, 'lxml')
title = soup.select('title')[0].getText()
print(f'title:{title}')
section_titles = soup.select('.mw-headline')
print('section titles:')
for index, section_title in enumerate(section_titles):
    print(f"\t {index}:{section_title.getText()}")
print('saving images to current working directory:')
images = soup.select('.image img')
for index, image in enumerate(images):
    image_link = requests.get(f"https:{image['src']}")
    with open(fr"{index}{os.path.splitext(image['src'])[1]}", mode='wb') as f:
        f.write(image_link.content)
print('saving images completed!')
