# My Webtech 2 lab's
------------------------

This respository contains all my labs for the course Webtechnology 2.
([visit my github Page:](http://l-ve.github.io/webtech2_labos/))

## Contents
-----------
* [Lab 1: Git to work](#lab1)
* [Lab 2: Mastering CSS-animations](#lab2)
* [Lab 3: Advanced Javascript](#lab3)
* [Lab 4: Building An App Prototype](#lab4)
* [Lab 5: TerrAppke - Weather-app (API's)](#lab5)
* [Lab 6: NodeJs](#lab6)
* [Lab 7: Final project: IMD WALL](#lab7)

========================================  

## <a name="lab1">1. Git to work</a>
------------------------------------------
### Lab contents:
This lab contains a little project in which we were asked to make a little recipe-website.
We then had to upload it to our git accounts. Thus making use of all the git commands we learned that lesson.

### Lessons learned: 
I already had some experience with git. I had to use it to store my final project during the PHP course I had the year before. 

### More about git:

| Git task                             | Git command                                                    |
| -------------------------------------|---------------------------------------------------------------:|
| Create a new local repository        | git init                                                       | 
| Create and Checkout a New Branch     | git checkout -b <branchName>                                   |
| Checkout a Remote Branch             | git checkout -b <localBranchName> origin/<remoteBranchName>    |
| Abort Changes of a File              | git checkout -- <fileName>                                     |
| Modify the Previous Commit's Message | git commit --amend                                             |
| Add Files                            | git add *   or    git <filename>                               |
| Commit changes to head               | git commit -m "Commit message"                                 |
| Undo the Previous Commit             | git revert HEAD^                                               |
| List the files you have changed      | git status                                                     |
| Delete the feature branch            | git branch -d <branchname>                                     |
| Checkout a repository                | git clone /path/to/repository                                  |
| Push a branch to a remote repository | git push origin <branchname>                                   |
| Uploads all local branch commits     | git push master origin                                         |

More commands can be found on [this cheat-sheet](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf) provided by github.



## <a name="lab2">2. Mastering CSS-animations</a>
------------------------------------------
### Lab contents:
This lab was an individual excercise in which we had to animate objects in 2 html-files.

### Lessons learned: 
CSS-Animations are really nice to have in a website when it's usefull, but not when they are just for show. It also gives nice effects. But not every browser uses the same convention (like Chrome user -webkit), so you have to watch out for that. 

### More about CSS-Animations:
* **Transitions**: A transition is an animation that happens between changes.It is placed between the off and on states.


```
transition: property duration timing-function delay;
   
transition: background-color 5s linear 1s;
```

* **Transformations**: Transformations are a different form of animation. Instead of bridging two states on an element, a transformation physically changes the look of the element. You can transform many aspects of an element, such as: scaling—changing the size of the element,rotating—spinning the element and translating—moving the element

```
<div id="shape"></div>

    #shape
    {
       width: 150px;
       height: 150px;
       background-color: #e74c3c;
       transition: -webkit-transform 1s;
    }


#shape:hover
  {
    -webkit-transform: scale(2) translateY(100px) rotate(45deg);
  };

```


* **Translations**: Translations are a transformation function that moves the element across the x- or y-axis. So, when you translate an element you are transforming it’s location. 

```
div
  {
    -ms-transform: translate(50px,100px); /* IE 9 */
    -webkit-transform: translate(50px,100px); /* Chrome, Safari, Opera */
    transform: translate(50px,100px);
   }
```


* **Animations**: CSS animations make it possible to animate transitions from one CSS style configuration to another. Animations consist of two components, a style describing the CSS animation and a set of keyframes that indicate the start and end states of the animation's style, as well as possible intermediate waypoints along the way.

```
.automatic
  {
   -webkit-animation: moveIt 2s infinite;
  }


  <div id="square" class="automatic"></div>


  @-webkit-keyframes moveIt
  {
     0% { }
     25% { -webkit-transform: rotate(45deg);}
     50% { left:50%; top: 50%; -webkit-transform: scale(2.5) rotate(45deg);}
     100% { -webkit-transform: rotate(0deg);}
   }
```



## <a name="lab3">3. Advanced Javascript</a>
------------------------------------------
### Lab contents:
In this lab we had to write a mini-framework to make a little todo-app. A framework like jQuery.

### Lessons learned: 
After this course I understood how a framework like jQuery works. And that you can write your own prototype functions.

### More about Advanced Javascript:
Functions like `$(“ul#todo li”).css(“color”, “red”);` in jQuery can be written like 

``` 
  HTMLElement.prototype.changeColor = function(color)
  {
      this.style["color"] = color;
  }
```


Then we can use our own function to change the text color of an element:

`document.getElementById("todo-item1").changeColor("purple");`

More information about Advanced Javascript can be found on the following sites:


[Introduction to Object-Oriented JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript)


[Learning advanced javascript](http://ejohn.org/apps/learn/#31)

## <a name="lab4">4. Building An App Prototype</a>
------------------------------------------
### Lab contents:
In lab 4 we had to create a weatherapp using weather api's, localstorage, ajax calls as well as use prototypical inheritance.

### Lessons learned:
I found this was the second most hardest subject we saw in our course Webtechnology 2. I already had experience with object oriented programming and this made me remember my Java programming lessons while studying Applied Informatics. I like this way of programming, it gives a more well-arranges structure. But still I had to get used to using it in Javascript.

### More about Advanced Javascript:
More info in the previous section (Lab3).


## <a name="lab5">5. TerrAppke - Weather-app (API's)</a>
------------------------------------------
### Lab contents:
For this lab we had to build an app that the teacher suggested or build your own idea. I worked together with a classmate ([Tom De Moore](https://github.com/tommooredotbe/webtech2-bestrepositoryeu)) to build this app. It's basically another weatherapp that show the current temperature along with information about our college and our fields of study and a subscription field. It's created to get new students (a sort of campaign). If it's sunny and warm outside, then they're invited to come and take a look at our school and enjoy a fresh drink, talk to our teachers and such. The background color as well as the temperature and the description change when the weather changes. 

### Lessons learned:
It started out as a simple app to build, but I got kind of caught up in it and it started to become more than a school assignment. I had a lot of fun building this app alongside [Tom](https://github.com/tommooredotbe/webtech2-bestrepositoryeu).

### More about TerrAppke :
We've used a lot of the subject mentioned above. And like I said before, I had a lot of fun with this app. My teammate and I formed a nice team and I'm proud of our little app. We worked hard so that maybe our app would be chosen for the school campaign.


## <a name="lab6">6. NodeJs</a>
------------------------------------------
### Lab contents:
This was our second to last assignment for the semester. We had to build a little chat-app with NodeJs.
So different people could send messages to each other and then vote these messages. The more votes a message had, the bigger the font of the message became. 

### Lessons learned:
I found that this was the hardest part of the course. And I found that a lot of fellow students had a lot of difficulties with this subject. At first, it was a lot of trial and error and research on the internet on how I could get my server up and running. That was the most difficult part. This was the most interesting assignment, I think. Especially because for my final project, I'm building another app in NodeJs.

### More about NodeJs:
NodeJs is Javascript on the server. It’s fast and event-driven (non-blocking io) and asynchronous (uses callbacks).
It's typically used in low latency apps, multiplayer online games, chat apps and live updating social streams.

More information can be found on the site of NodeJs:
[Nodejs.org](http://nodejs.org/)


## <a name="lab7">Lab 7: Final project: IMD WALL</a>
------------------------------------------
### Lab contents:
This final lab is our final project for Webtechnnology 2. For this assignment I build a kind of chat app for students who can send questions and answers to a global page. They can also vote questions and answers. There are two accounts in this app. A normal user who can login via Facebook and send messages and vote and an admin, who can delete posts.

### Lessons learned:
This was quite of a challenge because I had a lot of other projects going on. So basically I used NodeJs to build a realtime chat app,  Mongoose to save all of the messages, CSS animations to animate every new message that is appended to the messageslist. I also use passportjs to enable users to login with their Facebook-account. And finally I write a cookie that remembers users votes so that they cannnot vote up or down several times. We also had a lesson about Gulp ans SASS and this made it easier to style my app, minify my css and running my app locally.
 
Although it seems like a simple chat application, this was a lot of work. Especially using MongoDB and Mongoose.

### More about the uses technologies:


[Nodejs.org](http://nodejs.org/)


[Mongoosejs](http://mongoosejs.com/)


[MongoDB](http://www.mongodb.org)


[Passportjs](http://passportjs.org/)


[Gulpjs](http://gulpjs.com/)


[SASS](http://sass-lang.com/)



