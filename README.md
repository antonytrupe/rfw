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
magical portals that let you fast travel but age you based on normal travel speed

## TODO
1. touch controls
1. ability to claim a character  
1. ability to view claimed characters
2. keep a list of only characters that need processed by the server(lots of still characters shouldnt increase tick time)
3. random stats when spawning  
4. no moving while incapacitated/dying/dead  
5. collision  
6. combat  
7. leveling up system  
8. package as exe/etc with electron
9. add steam support
10. change the position calculation with respect to turning
https://math.stackexchange.com/questions/311555/how-to-calculate-the-position-of-a-turning-object-based-on-its-rotation
11. admin tool to interact with world
12. stay centered on selected characters
13. rightclick move the screen
14. change selected character stats
15. chat
16. randomly spawn new characters
17. randomly move characters
18. character health ui

## DONE
ability to zoom to a character
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
