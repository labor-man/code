### Decorator is a function that creates a wrapper around another function. This wrapper adds some additional functionality to existing code.


# ----------------------------------------------------------------

# def log(func):
# 	def inside_func(*args, **kwargs):
# 		'''This is inside_func doc'''
# 		print('start running')
# 		return func(*args, **kwargs)
# 	return inside_func

# def sum(x, y):
# 	'''This is sum doc'''
# 	return x + y

# log_sum = log(sum)
# print(log_sum(1, 1))

# ----------------------------------------------------------------

# def log(func):
# 	def inside_func(*args, **kwargs):
# 		'''This is inside_func doc'''
# 		print('start running')
# 		return func(*args, **kwargs)
# 	return inside_func

# @log
# def sum(x, y):
# 	'''This is sum doc'''
# 	return x + y

# print(sum(1, 1))
# print('sum doc:{}'.format(sum.__doc__))

# ----------------------------------------------------------------

# from functools import wraps

# def log(func):
# 	@wraps(func)
# 	def inside_func(*args, **kwargs):
# 		'''This is inside_func doc'''
# 		print('start running')
# 		return func(*args, **kwargs)
# 	return inside_func

# @log
# def sum(x, y):
# 	'''This is sum doc'''
# 	return x + y

# print(sum(1, 1))
# print('sum doc:{}'.format(sum.__doc__))

# Decorators with arguments--------------------------------------

# from functools import wraps

# def log(prefix = 'result'):
# 	def log_inside(func):
# 		@wraps(func)
# 		def inside_func(*args, **kwargs):
# 			'''This is inside_func doc'''
# 			print('start running')
# 			return "{} : {}".format(prefix, func(*args, **kwargs))
# 		return inside_func

# 	return log_inside

# @log()
# def sum(x, y):
# 	'''This is sum doc'''
# 	return x + y

# print(sum(1, 1))
# print('sum doc:{}'.format(sum.__doc__))

# ----------------------------------------------------------------

# Decorators with arguments

# from functools import wraps

# def log(prefix = 'result'):
# 	def log_inside(func):
# 		@wraps(func)
# 		def inside_func(*args, **kwargs):
# 			'''This is inside_func doc'''
# 			print('start running')
# 			return "{} : {}".format(prefix, func(*args, **kwargs))
# 		return inside_func

# 	return log_inside

# @log
# def sum(x, y):
# 	'''This is sum doc'''
# 	return x + y

# print(sum(1, 1))
# print('sum doc:{}'.format(sum.__doc__))	# error


# Decorators with arguments-------------------------------------

# from functools import wraps, partial

# def log(func=None, *, prefix = 'result'):
# 	if func is None:
# 		return partial(log, prefix = prefix)

# 	@wraps(func)
# 	def inside_func(*args, **kwargs):
# 		'''This is inside_func doc'''
# 		print('start running')
# 		return "{} : {}".format(prefix, func(*args, **kwargs))

# 	return inside_func


# @log(prefix='res')
# def sum(x, y):
# 	'''This is sum doc'''
# 	return x + y

# print(sum(1, 1))
# print('sum doc:{}'.format(sum.__doc__))

# @log
# def sum(x, y):
# 	'''This is sum doc'''
# 	return x + y

# print(sum(1, 1))
# print('sum doc:{}'.format(sum.__doc__))


# Decorators inside the class-----------------------------------


# from datetime import datetime
# from functools import wraps

# class DateDecorator(object):
# 	def instanceMethodDecorator(self, f):	# !!! class method always have self parameter
# 		@wraps(f)
# 		def inside_f(*args, **kwargs):
# 			print('instance method decorator at time:\n{}'.format(datetime.now()))
# 			return f(*args, **kwargs)
# 		return inside_f

# 	@classmethod
# 	def classMethodDecorator(self, f):	# !!! class method always have self parameter
# 		@wraps(f)
# 		def inside_f(*args, **kwargs):
# 			print('class method decorator at time:\n{}'.format(datetime.now()))
# 			return f(*args, **kwargs)
# 		return inside_f

# dateDecorator = DateDecorator()

# @dateDecorator.instanceMethodDecorator
# def sum(x, y):
# 	return x + y

# print(sum(1, 1))

# @DateDecorator.classMethodDecorator
# def subs(x, y):
# 	return x - y

# print(subs(2, 1))