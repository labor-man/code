# libs:built-in csv, PyPDF2

print('working with csv file...')
import csv
csv_file = open('find_the_link.csv')
csv_data = csv.reader(csv_file)
result_url_list = []
for index, line in enumerate(list(csv_data)):
    result_url_list.append(line[index])
print(f"target pdf in:{''.join(result_url_list)}")


print('working with pdf file...')
from PyPDF2 import PdfFileReader
import re

pdf_file = open('Find_the_Phone_Number.pdf', mode='rb')
pdf_data = PdfFileReader(pdf_file)

pattern = re.compile(r'[\d]{3}.?[\d]{3}.?[\d]{4}')
for pageNum in range(pdf_data.numPages):
    page = pdf_data.getPage(pageNum)
    text = page.extractText()
    
    match = pattern.search(text)
    if match:
        print(f"The phone number of the puzzle answer is {match.group()}")
        break