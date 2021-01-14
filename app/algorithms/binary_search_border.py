def binary_search_border(l, v, left = True):
    low = 0 
    high = len(l) - 1
    
    result_index = None
    
    while low <= high:
        mid = (low + high) // 2
        guess = l[mid]
        
        if guess == v:
            result_index = mid
            if left:
                high = mid - 1
            else :
                low = mid + 1
        elif guess < v:
            low = mid + 1
        elif guess > v:
            high = mid - 1
    
    return result_index

# test case
l = [1,2,3,4,5,5,5,5,5,7,8,9] 
left = binary_search_border(l, 5)
right = binary_search_border(l, 5, left=False)
print(f'left:{left}, right:{right}')