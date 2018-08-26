# note-todos-api
Link Heroku: https://todo-with-mongodb.herokuapp.com/ 

Express web app, tạo các todos list cho các user 

Trước hết tạo user, hoặc login user ( nếu login sai, hoặc không login sẽ bị lỗi )

Bảo mật bằng jsonwebtoken và bcryptjs 

Sử dụng bằng Postman dùng các phương thức POST, GET, DELETE và PATCH 

Khi chưa login, Post 1 todo list, lưu vào MongoDB, sẽ bị lỗi 401 Unauthorized

![image](https://user-images.githubusercontent.com/24961250/44624626-3f8ab200-a91d-11e8-85ef-ac911d7eea50.png)

Tạo 1 user, server sẽ check email và password nếu thõa mãn, không trùng trong MongoDB sẽ tạo mới, lưu vào mongoDB, đồng thời response token vào header x-auth

![image](https://user-images.githubusercontent.com/24961250/44624646-a8722a00-a91d-11e8-8572-a6a90ff4b469.png)
![image](https://user-images.githubusercontent.com/24961250/44624649-b6c04600-a91d-11e8-9b8d-3e8952bb37b2.png)

Quay trở lại tạo Todo, với user đã được tạo và login

![image](https://user-images.githubusercontent.com/24961250/44624714-e53f2080-a91f-11e8-98f1-12309b937a64.png)
![image](https://user-images.githubusercontent.com/24961250/44624662-07d03a00-a91e-11e8-8a47-7f239ef3a129.png)

{{x-auth}} là token lấy được ở trên

![image](https://user-images.githubusercontent.com/24961250/44624664-20405480-a91e-11e8-9427-f7822b02d9ac.png)

=> Success!

![image](https://user-images.githubusercontent.com/24961250/44624667-41a14080-a91e-11e8-8930-f4e3b80e387c.png)

Còn có phương thức khác:

GET /todos : lấy toàn bộ todos list từ mongoDB

![image](https://user-images.githubusercontent.com/24961250/44624677-71504880-a91e-11e8-8b86-bd506540b227.png)

DELETE /todos/:id: Xóa một todo với id của nó

PATCH /todos/:id: Sửa một todo với id của nó

POST  /users/: Tạo một user

GET /users/me: Xem user đang login là ai

POST /users/login: Login với email và password

DELETE /users/me/token: Logout với token

![image](https://user-images.githubusercontent.com/24961250/44624689-12d79a00-a91f-11e8-9497-3ed6ded7919d.png)



