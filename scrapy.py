from bs4 import BeautifulSoup
from lxml import html
import xml
import requests

url="https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=prepared%20food&sort_by=unique_scans_n&page_size=20&page="
#instant food url:"https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=instant food&sort_by=unique_scans_n&page_size=20&page="
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
ingredientsList=[]
ingredients=[]
n=0
urlApiRecette="http://api.apps.asidirasga.me/recettes"
urlApiIngredient="http://api.apps.asidirasga.me/ingredients"
print("begin update")

for i in range(len(preparedFoodList)):
    f=requests.get(preparedFoodList[i])
    soup = BeautifulSoup(f.content, "lxml")
    k=soup.find_all("div",id="ingredients_list")
    ingredientsList.append(deleteLettersInBracketsAndPercent(k[0].text).split(","))
    urlImage=soup.find_all("img",id="og_image")[0]["src"]
    r = requests.get(urlImage,stream=True)
    with open("img/"+str(i)+".jpg", 'wb') as fd:
        for chunk in r.iter_content():
            fd.write(chunk)
    for m in ingredientsList[i]:
        if(m not in ingredients):
            dataIngredient={
                "nom":m,
                "uniteMesure":"NoUnit"
            }
            f=requests.post(urlApiIngredient,dataIngredient)
            print(f.text)
            ingredients.append(m)
            n+=1
        else:
            requests.post(urlApiRecette,data)
    data={
            "title":foodName[i],
            "readyInMinutes":"Prepared",
            "servings":"1",
            "ingredients":i+1850,
            "externalId":"1",#je ne sais pas comment gerer externalid
            "photopath":"img/"+str(i)+".jpg"
        }
    f=requests.post(urlApiRecette,data)
    print(f.text)
