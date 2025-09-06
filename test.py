import os

def calculate_area(length: float, width: float) -> float:
    """Calculates the area of a rectangle."""
    if length <= 0 or width <= 0:
        raise ValueError("Dimensions must be positive")
    return length * width

class Dog:
    """A class to represent a dog."""
    species = "Canis lupus familiaris"

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name} says woof!"

# Main execution block
if __name__ == "__main__":
    area = calculate_area(10.5, 4)
    print(f"The area is: {area}")

    my_dog = Dog("Rex", 5)
    print(my_dog.bark())
