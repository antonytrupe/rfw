## INFO
how to run  
npm install  
npm run dev, or npm run nodemon to pick up changes to the server 

## themes/principles/ideas
perma death  
no static spawns  
cultures/cities/civilizations grow and die on their own  
gods can intervene to bring back balance(repopulate/wipe out)  
play muliple characters but not at once  
able to give characters goals(move to a new location, focus on a career)  
magical portals that let you fast travel but age you based on normal travel speed

## TODO LIST
1. turn dead characters into tombstones
2. walls/caves
3. fog-of-war
4. fight/flight/assist/social/factions
5. pathing/patrol
6. healing/long/short rest
7. running away
8. character age
9. attack of opportunities
10. say/yell/whisper
11. teleport
12. persistance outside the container, maybe google datastore? https://github.com/googleapis/nodejs-datastore
13. touch controls
14. random stats when spawning 
15. strafing 
16. package as exe/etc with electron
17. add steam support
18. admin tool to interact with world
19. stay centered on selected characters
20. rightclick move the screen
21. change selected character stats
22. randomly spawn new characters
23. randomly move characters
24. character health ui

## DONE
basic chat
no moving while incapacitated/dying/dead 
sliding around more then one object
make manual input override move action
keep a list of only characters that need processed by the server(lots of still characters shouldnt increase tick time)
change the position calculation with respect to turning
collision 
leveling up system 
fighting back
unclaim character
uncontrol character
send events to the client
some sort of animation for attacking
combat
show the targeted character
turn clock/timer
ability to claim a character 
ability to view claimed characters
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
