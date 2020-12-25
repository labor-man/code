def binary_search_border(li, item, left = True): 
    index = None 
    low = 0 
    high = len(li) - 1 
    while low < high: 
        mid = (low + high) // 2 
        if li[mid] == item: 
            index = mid 
            if left: 
                high = mid 
            else : 
                low = mid + 1 
        elif l[mid] < item: 
            low = mid + 1 
        elif l[mid] > item: 
            high = mid 
    return index

# test case
l = [1,2,3,4,5,5,5,5,5,7,8,9] 
left = binary_search_border(l, 5)
right = binary_search_border(l, 5, left=False)
print(f'left:{left}, right:{right}')