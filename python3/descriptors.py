# Descriptor gives us the fine control over the attribute access.

# 一个描述器是一个包含 “绑定行为” 的对象，对其属性的访问被描述器协议中定义的方法覆盖。如果某个对象中定义了这些方法中的任意一个，那么这个对象就可以被称为一个描述器。

# 属性访问的默认行为是从一个对象的字典中获取、设置或删除属性。例如，a.x 的查找顺序会从 a.__dict__['x'] 开始，然后是 type(a).__dict__['x']，接下来依次查找 type(a) 的基类，不包括元类。 如果找到的值是定义了某个描述器方法的对象，则 Python 可能会重载默认行为并转而发起调用描述器方法。这具体发生在优先级链的哪个环节则要根据所定义的描述器方法及其被调用的方式来决定。

# 描述器协议
# descr.__get__(self, obj, type=None) -> value
# descr.__set__(self, obj, value) -> None
# descr.__delete__(self, obj) -> None

# python doc https://docs.python.org/zh-cn/3/howto/descriptor.html

# ------------------------------------------------------------------

# class Squire(object):
#   def __init__(self, side):
#       self.side = side

#   def fget(self):
#       return self.side ** 2

#   def fset(self, v):
#       print('can not set!')

#   def fdel(self):
#       print('can not del!')

#   area = property(fget, fset, fdel, doc='this is the area')

# squire = Squire(10)

# print(squire.area)

# squire.area = 50

# print(squire.area)

# del(squire.area)

# ------------------------------------------------------------------

# class Squire(object):
#   def __init__(self, side):
#       self.side = side

#   @property
#   def area(self):
#       return self.side ** 2
    
#   # ?
#   @area.setter
#   def area(self, v):
#       print('can not set!')

#   # ?
#   @area.deleter
#   def area(self):
#       print('can not del!')

# squire = Squire(10)

# print(squire.area)

# squire.area = 50

# print(squire.area)

# del(squire.area)

# ------------------------------------------------------------------

# def my_decorator(f):
#   names_dict = f()

#   return property(**names_dict)


# class Squire(object):
#   def __init__(self, side):
#       self.side = side

#   @my_decorator
#   def area():
#       def fget(self):
#           return self.side ** 2

#       def fset(self, v):
#           print('can not set!')

#       def fdel(self):
#           print('can not del!')

#       doc = 'this is doc'

#       return locals()


# squire = Squire(10)

# print(squire.area)

# squire.area = 50

# print(squire.area)

# del(squire.area)


#   @propery is good for performing certain operations before get, set and delete operation. But, we need to implement it for all the functions separately and code becomes repetitive for larger number of methods. In such cases, descriptors can be useful.
# Data Descriptors--------------------------------------------------






















