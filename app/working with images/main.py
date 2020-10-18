from PIL import Image
word_matrix = Image.open('word_matrix.png')
mask = Image.open('mask.png')
resized_word_matrix = word_matrix.resize(mask.size)
mask.putalpha(128)
resized_word_matrix.paste(im=mask, box=(0,0), mask=mask)
resized_word_matrix.save('result.png')