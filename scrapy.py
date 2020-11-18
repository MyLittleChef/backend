from bs4 import BeautifulSoup
from lxml import html
import xml
import requests

url="https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=prepared%20food&sort_by=unique_scans_n&page_size=20&page="
foodPageUrl="https://world.openfoodfacts.org"
preparedFoodList=[]
for i in range(1,60):
    urlR=url+str(i)
    f = requests.get(url)
    soup = BeautifulSoup(f.content, "lxml")
    for k in soup.find_all("ul",class_="products"):
        for i in k.find_all("a"):
            preparedFoodList.append(foodPageUrl+i["href"])
def deleteLettersInBracketsAndPercent(s):
    while(True):
        begin=s.find("(")
        end=s.find(")")
        if(begin==-1):
            break
        if(end==-1):
            end=len(s)
            s=s[:begin]
        else:
            s=s[:begin]+s[end+1:]
    while(True):
        loc=s.find("%")
        if(loc==-1):
            break
        i=loc
        while(True):
            if(s[i]==" "):
                break
            i-=1
        s=s[:i]+s[loc+1:]
    beg=0
    while(True):
        loc=s.find(",",beg)
        if(loc==-1 or loc==len(s)-1):
            break
        if(s[loc-1].isnumeric() and s[loc+1].isnumeric()):
            s=s[:loc]+"."+s[loc+1:]
        beg=loc+1
    return s
def foodNameList(foodUrlList):
    l=[]
    for i in foodUrlList:
        l.append(i[i.rfind("/")+1:].replace("-"," "))
    return l
foodName=foodNameList(preparedFoodList)

sqlFile=open("preparedfood.sql","w")
for i in range(len(foodName)):
    sqlFile.write("insert into recette (id, title,dishTypes) values ("+str(i)+",\""+foodName[i]+"\",\"PreparedFood\");\n")

ingredientsList=[]
ingredients=[]
n=0
for i in range(len(preparedFoodList)):
    f=requests.get(preparedFoodList[i])
    soup = BeautifulSoup(f.content, "lxml")
    k=soup.find_all("div",id="ingredients_list")
    ingredientsList.append(deleteLettersInBracketsAndPercent(k[0].text).split(","))
    for m in ingredientsList[i]:
        if(m not in ingredients):
            sqlFile.write("insert into ingredient (id,nom) values ("+str(n)+",\""+m+"\");\n")
            sqlFile.write("insert into recette_ingredients (recetteId,ingredientId) values("+str(i)+","+str(n)+");\n")
            ingredients.append(m)
            n+=1
        else:
            loc=ingredients.index(m)
            sqlFile.write("insert into recette_ingredients (recetteId,ingredientId) values("+str(i)+","+str(loc)+");\n")