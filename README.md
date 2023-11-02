## INFO
how to run  
npm install  
npm run dev  

## themes/principles/ideas
perma death  
no static spawns  
cultures/cities/civilizations grow and die on their own  
gods can intervene to bring back balance(repopulate/wipe out)  
play muliple characters but not at once  
able to give characters goals(move to a new location, focus on a career)  

## TODO
1. touch controls
2. ability to claim a character  
3. keep a list of only characters that need processed by the server(lots of still characters shouldnt increase tick time)
3. random stats when spawning  
4. no moving while incapacitated/dying/dead  
5. collision  
6. combat
7. strafing  
8. leveling up system  
9. package as exe/etc with electron
10. add steam support
11. change the position calculation with respect to turning
https://math.stackexchange.com/questions/311555/how-to-calculate-the-position-of-a-turning-object-based-on-its-rotation
12. admin tool to interact with world
13. stay centered on selected characters
14. rightclick move the screen
15. change selected character stats
16. chat
17. randomly spawn new characters
18. randomly move characters
19. character health ui

## DONE
make the client only request what it can see
reconnect automatically
reconnect after disconnect
make zooming out scale faster
add race to community generation
place communities in center of client viewport
connect automatically
community generation
added dying hp indicator
disintegrate
clean up draw resetting
character health ui
zoom centered on mouse
fix the jump from sprinting to running
miles/hour scale
only send updated characters to the client
get the server engine ticking
got server engine persisting
double run with shift
move stuff out of world.ts
double run with shift
change default scale to turn ratio
show selected character stats
change default zoom
deploy to somewhere public
create docker image
deploy to docker container
zooming
click on a character to take control
distance scale ui
tweak movement speed
switch to canvas
persistance layer
get hot loading working
get the html page out of dist
set up git repo
get dev mode working
rip out pong
player entities
move left and right

## WONTFIX
replace node-json-db with redis
