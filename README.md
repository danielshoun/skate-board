# Skate Board

Live Link: [Skate Board](https://skate-board-js.herokuapp.com)

![SkateBoardScreenShot](https://i.imgur.com/6AKfdos.png)

Skate Board is a community-building website where users can create and manage their own message boards. Skate Board
draws inspiration from Reddit, but uses a more traditional message board system for communication. Posts are shown in
chronological order, and users can style their posts using BBCode and smilie keywords.

Detailed information on the database schema and routing can be found in the [wiki](https://github.com/danielshoun/skate-board/wiki/MVP-Features).

# Technologies

**Front End**
- React
- Redux

**Back End**
- Python
- Flask
- SQLAlchemy
- PostgreSQL

# Features

- User authentication system.
- User created message boards that can be edited/deleted.
- Users can join any message board not marked as private via a directory.
- Members of a board can post threads that other members can reply to.
- Editing/Deleting of threads and included posts.
- Board owners can pin threads to the top of the board or lock them to prevent further replies.
- Posts can be formatted using [BBCode](https://www.bbcode.org/). A formatting toolbar is included for ease of use.
- Users can include smilie keywords in their posts that will automatically be replaced with an image.
- Board owners can upload custom smilies for use only within a certain board.

# Usage

To run this application:

1. Clone this repository (only this branch)

   ```bash
   git clone https://github.com/danielshoun/skate-board.git
   ```

2. Install dependencies

   ```bash
   pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
   ```

3. Create a **.env** file based on the **.env.example** file
4. Setup a PostgreSQL user, password and database that matches the **.env** file

5. Enter the python virtual environment, migrate the database, seed the database, and run the flask app

   ```bash
   pipenv shell
   ```
   ```bash
   flask db upgrade
   ```
   ```bash
   flask seed all
   ```
   ```bash
   flask run
   ```

6. Install front end dependencies from the `react-app` directory and then run the front end server
   ```bash
   npm install && npm run
   ```
   
# Future Features

- [ ] Ability to invite users to private boards.
- [ ] Ability to direct message other users.
- [ ] Moderation system (Banning, muting, etc.)
