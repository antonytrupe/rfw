## INFO
how to run  
npm install  
npm run dev, or npm run nodemon to pick up changes to the server 

gcloud beta emulators datastore env-init > set_vars.cmd && set_vars.cmd
gcloud beta emulators datastore start --project=rfw2-403802 --no-store-on-disk 

## game progression/tutorial
1. zooming
2. claiming a character
3. movement
4. attacking
5. health
6. short rest
7. chat
8. commands
9. fast travel/aging
10. long rest
11. job
12. first character death
13. claiming a second character

## themes/principles/ideas
perma death  
no static spawns  
cultures/cities/civilizations grow and die on their own  
gods can intervene to bring back balance(repopulate/wipe out)  
play muliple characters but not at once  
able to give characters goals(move to a new location, focus on a career)  
magical portals that let you fast travel but age you based on normal travel speed

## commands
/create thorp|hamlet|village|small_town|large_town|small_city|large_city|metropolis human|etc

## TODO LIST
2. low level monsters
3. system to propose and approve new items/spells/abilities
4. generate random encounter
5. generate buildings with communitties
6. zoom out visuals
7. assign roles to characters
8. "delete character" command
9. "delete all characters" command
10. fix the tooltip
11. line of sight
12. vision distance
13. low light/dark light vision
14. characters having their own verion/copy of the world/map
15. characters sharing maps
16. characters editing their map
17. buildings
18. walls/caves
19. fog-of-war
20. fight/flight/assist/social/factions
21. pathing/patrol
22. healing/long/short rest
23. running away
24. character age
25. attack of opportunities
26. say/yell/whisper
27. teleport
28. persistance outside the container, maybe google datastore? https://github.com/googleapis/nodejs-datastore
29. touch controls
30. random stats when spawning 
31. strafing 
32. package as exe/etc with electron
33. add steam support
34. admin tool to interact with world
35. stay centered on selected characters
36. rightclick move the screen
37. change selected character stats
38. randomly spawn new characters
39. randomly move characters
40. character health ui