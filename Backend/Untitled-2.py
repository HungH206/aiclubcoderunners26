'''

This program is designed to collect information about a student's major, ethnicity and name.

'''

#List of said ethnicities, this is used to check if the user input is valid. 


Ethnicities = ["Asian", "African American", "White", "Latino", "Perfer not to say", "Native American", "Pacific Islander", "Middle Eastern"]


Name = input("What is your name? ")
Ethnicity = input("What is your ethnicity? ")

#Checks if ethnicity is valid, if not it will ask the user to input a valid response.
while Ethnicity not in Ethnicities:
    print("Not a valid ethnicity. Please enter a valid ethnicity.")
    Ethnicity = input("What is your ethnicity? ")
    
Major = input("What is your desired major? ")   

interests = input.split("What are your interests?")

print("Student: " + Name)
print("Ethnicity: " + Ethnicity) 
print("Major: " + Major)
print("Interests: " + interests)











