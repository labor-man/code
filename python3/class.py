# polymorphism
print('--------------------polymorphism------------------')

class Animal():
	def __init__(self, name):
		self.name = name

	def speak(self):
		raise NotImplementedError('Subclass must implement this abstract method!')

class Dog(Animal):
	def speak(self):
		return f'{self.name} says woof!'

class Cat(Animal):
	def speak(self):
		return f'{self.name} says meow!'		

Sam = Dog('Sam')
print(Sam.speak())

Cleo = Cat('Cleo')
print(Cleo.speak())

print('----------------------------------------------------')

# special methods
print('--------------------special methods------------------')

class Book():
	def __init__(self, title, author, pages):
		self.title = title
		self.author = author
		self.pages = pages

	def __str__(self):
		return f'{self.title} by {self.author}'

	def __len__(self):
		return self.pages

book = Book('Steve Jobs', 'Walter Isaacson', 500)

print(f'book str: {book}')
print(f'book len: {len(book)}')
print('-----------------------------------------------------')