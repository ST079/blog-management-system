npm init
npm install -- express, mongoose, dotenv, morgan
npm i --save-dev nodemon
script
app set
env variable
routes
error handling
middlewares
logger
database connect
mvc => modules

=======================================

# blog management system

1.user management
2.blog management
3.roles
4.email notifications

# user

1.login/logout
2.register(bcryptjs)
3.update profile
4.forgot password
5.reset passwotd (admin)
6.change password
7.get prfile

# blog

1.get all blogs/get one blogs
2.add new blog/ delete blog
3.edit blog
4.search blog
5.bookmark blog

# Register

-> user model {name,email,password}
-> create register controller
-> create post route as /api/users/register
-> update req.body in controller as password ==> bcrypt(hash pw)
-> send email to user about successful signup

# login /Authentication

-> create login controller
-> creat post route as /api/v1/users/login
-> in controller get req.body [email and password]
-> check, if user exist get hashpw from the data base
-> compare user provided password with hash password
-> if result false, throw error [ email or password mismatched]
-> Additional works
-system needs to send something back to user[accesstoken]
-token creation(authorization)

----Start the authorization process
-npm install jsonwebtoken
-jsonwebtoken , 2 utility function (token generate / token validate)
-create a token js utility file

-if user successfully login:

- create the user payload for the jsonsign utility for signing
- get the token and check the token in jwt.io website, check for expiration and data in JSON Object

-send the token to the user through login api
-send the token for every request in the header
-checkrole middlewate update using token validate utility function
-if false, permission denied error throw
-if true, next()

-cookie,session, json web token

--add blog
--view all blogs
