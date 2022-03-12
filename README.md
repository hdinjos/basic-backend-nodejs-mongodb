# How to run

## Install

before install you need to setup mongodb comunity in local computer

after that run in terminal:

`yarn install`

or

`npm install`

## Running developer

`yarn run dev`

or

`npm run dev`

access to the web API on API testing like postman/insomnia or consume on the Frontend

**hostname**: http://localhost:3000

## API web services

***AUTH***

1. **Login:  POST =>  hostname/api/login** 

   payload: JSON

   {
   	"email":"saputra@gg.com",
   	"password": "123456"
   }

2. **Register:  POST =>  hostname/api/register** 

   payload: JSON

   {
   	"email":"saputra@gg.com",
   	"password": "123456",
   	"firstName": "saputra",
   	"lastName": "hendi"
   }

3. **Refresh Token:  POST =>  hostname/api/refreshToken** 

   payload: JSON

   {
   	"refreshToken": "KZfa3KJrtymAeVa1JSqChuodwZJbzXyOaeTHkGmkWnoPNpjlsBYo6JBpynFG2a3PMn93cqdJ5mY8EozX9GZ4uoF1B4Qj2o4YY1F6zbDKu5pN46sDVf4ufxijZ3Yc1l4zbJSfrQy0J5OtM15I85zLBbu73jCwpufrSKoo0deOx5fTiDUCGAsaTB6EFc2D07jH74rX30K28lkik2XgheeonjM2lnpkhA4n77tWjcodgK77cFlJvncnvSKRXBvN7ePi"
   }

4. **Get profile:  GET =>  hostname/api/users**

    header: 

   ​	Authorization: Bearer token

   ​	(token can get after hit endpoint hostname/api/login use "accessToken" value)

   

***CRUD***

1. **Get list items:  GET =>  hostname/api/items** 

   header: 

   ​	Authorization: Bearer token

   ​	(token can get after hit endpoint hostname/api/login use "accessToken" value)

2. **Get Item by id:  GET =>  hostname/api/item/id**

   header: 

   ​	Authorization: Bearer token

   ​	(token can get after hit endpoint hostname/api/login use "accessToken" value)

   params:

   params (id) can change with id items in list items 

   ex: hostname/api/item/61e8eba2654f72b21281a31

3. **create item:  POST =>  hostname/api/item**

   header: 

   ​	Authorization: Bearer token

   ​	(token can get after hit endpoint hostname/api/login use "accessToken" value)

   payload: JSON

   {
    	"itemName": "Monitor",
   	"itemColor": "white",
   	"itemDescription": "Merk lg, ukuran 21 inci. LED",
   	"itemQty": 0.8
   }

4. **edit item:  PUT =>  hostname/api/item/id**

   header: 

   ​	Authorization: Bearer token

   ​	(token can get after hit endpoint hostname/api/login use "accessToken" value)

   params:

   params (id) can change with id items in list items 

   ex: hostname/api/item/61e8eba2654f72b21281a31

   payload: JSON

   {
    	"itemName": "laptop MSI OLEOLE",
   	"itemColor": "Pink",
   	"itemDescription": "laptop MSI 93493jj, bagus barangnya. mantap",
   	"itemQty": 9
   }

5. **delete item:  DELETE =>  hostname/api/item/id**

   header: 

   ​	Authorization: Bearer token

   ​	(token can get after hit endpoint hostname/api/login use "accessToken" value)

   params:

   params (id) can change with id items in list items 

   ex: hostname/api/item/61e8eba2654f72b21281a31