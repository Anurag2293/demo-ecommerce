
## Question Statement

Q2. Develop a simple sign-up and login flow for an e-commerce website where users are able to mark the categories that they are interested in. Design Link: https://www.figma.com/file/EjNZkDNTtgERV5PgF0mxnt/MERN-Assignment?type=design&node-id=33%3A667&mode=design&t=6k9GiDcswPavM0TD-1

You will see 4 screens in the design. First 2 are for the registration of new users, the third one is for the login of an existing user and the 4th one is a protected page that only logged in users can access. On this protected page, users see a list of categories that we have in our database (you can use faker to generate this data - https://fakerjs.dev/). Create 100 entries for the categories in your database using faker. Users can mark the categories that they are interested in. This is a paginated list where only 6 categories are visible at a time. Users can interact with pagination to see categories on various pages. Users should be able to see what categories they selected when they logout and login again. So we should store what they check in our database.
The header is common for all the pages. The header should be static for the scope of this assignment and should not have any interactions like menus flying out.

What tech to use?

Database: MySQL or Postgres. We recommend using https://neon.tech/ that offers a free postgres database. If you are comfortable with any other database provider than neon, please feel free to use that. Using RDBMS is a must.
Framework: We recommend using https://create.t3.gg/. This will provide you with Next.js for developing react components. tRPC for writing APIs. Prisma as a database ORM and tailwind setup for writing CSS. Please do not use NextAuth.js for this task. If you wish to write APIs outside tRPC in Next.js, feel free to do so. You can do it normally in Next.js - https://create.t3.gg/en/usage/trpc#how-do-i-call-my-api-externally.
VCS: Push your code on github and share the repository link. Please make sure you create a public repository.
App hosting: We recommend hosting your app on vercel’s free tier- https://vercel.dev/. If you have experience with any other free Next.js hosting provider, feel free to use that.
Can I use some other tech stack?
We insist against using what’s recommended above.
One reason is that we want to test how well you acclimatise yourself with a new tech within your general area of expertise.
And second, we are able to evaluate your submissions uniformly against other submissions that we receive.

For the video link field, record one video showing the demos of both your projects. Use Loom (https://www.loom.com/) to record yourself and your computer screen. Minimum duration should be 2 minutes, maximum 5 minutes and the ideal length would be around 3-4 minutes. Replace "share" with "embed" in loom link, so it'd become like https://www.loom.com/embed/xyz

Submit Answer

## TODO

ESSENTIAL
- [x] deploy to vercel
- [x] learn about trpc
- [x] demo api with trpc
- [x] generate data (faker.js) & send to server (first update prisma)

- [x] create user schema
- [x] frontend & backend for user signup
- [x] setup email sending service
- [x] frontend & backend for otp signup
- [x] frontend & backend for user signin
- [x] create furnished navbar
- [x] create furnished ui for signup, otp & signin page

- [x] Display Categories using pagination (frontend & backend)
- [x] Let users select their categories (db, backend, frontend)
- [x] Let users deselect ther categories (backend & frontend)
- [x] Make UI nice for Categories page

OPTIONAL (but important)
- [x] store password in hash form (update remaining code acc/)
- [x] do auth using JWT
- [x] alert dialogs
- [x] Logout Button
- [ ] responsive website
- [ ] can verifyOTP while login also

THINK ABOUT
- [x] Where will you fetch user info if we have JWT Auth and we can directly login using JWT tokens?
