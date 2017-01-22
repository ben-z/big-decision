###Live Preview
www.screenkraut.me

## Inspiration
Normal presentation tools are bloated and cumbersome to use. We wanted to make something for the average person on the go, where time is of the essence and efficiency is key.
 
## What it does
ScreenKraut is a presentation platform for building and sharing ideas **fast**. Using our built in text editor, instantly create your presentation then broadcast it to others with a uniquely generated shared link. With the link, they'll see your presentation live on their devices, directly mirroring your current slide position, so that all you need to do is simply click "next" as you present for everyone watching to follow along. Prototype and execute with anything and anywhere, the only thing you'll need to create a fully fledged presentation in minutes is an internet connection and an idea.

## How we built it
The whole backend is based on Node.js. We are serving the whole site, only through the node.js server, so we don't need to run anything heavyweight like Apache. Live presentation features are based on websockets. Every new client registers at the server, and gets push notifications when the next slide should be accessed. Apart from saving the client IDs the server works in a completely stateless format.

## Challenges we ran into
In the beginning, we used only Node.js for the backend but soon realized that it would be way to complicated of a solution to implement. Luckily after some research, we managed to find Express.js, a middleware abstraction from Node.js, that really simplified things. We ended up having to rebuild our entire backend code, but by the end of it, our code was much cleaner and streamlined. 

## Accomplishments that we're proud of
We are the first web application to market that provides instant slide creation and sharing using little to no bandwith. 

## What we learned
It was a learning experience for many of us this year at Penn Apps. For some, it was their first experience diving into front end development using services, and for others it was their first back end ventures. Either way, both sides of our team learned an extreme deal.

## What's next for ScreenKraut
We hope to inspire as many hackers at Penn Apps as we can to use Screen Kraut for their presentations. Our product is simple and streamlined providing easy scale and adaption.
