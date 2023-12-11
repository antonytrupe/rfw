## INFO
how to run  
npm install  
npm run dev, or npm run nodemon to pick up changes to the server 

gcloud beta emulators datastore env-init > set_vars.cmd && set_vars.cmd
gcloud beta emulators datastore start --project=rfw2-403802 --no-store-on-disk 


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
3. generate random encounter
4. generate buildings with communitties
5. zoom out visuals
6. assign roles to characters
7. "delete character" command
8. "delete all characters" command
9.  fix the tooltip
10. line of sight
11. vision distance
12. low light/dark light vision
13. characters having their own verion/copy of the world/map
14. characters sharing maps
15. characters editing their map
16. buildings
17. walls/caves
18. fog-of-war
19. fight/flight/assist/social/factions
20. pathing/patrol
21. healing/long/short rest
22. running away
23. character age
24. attack of opportunities
25. say/yell/whisper
26. teleport
27. persistance outside the container, maybe google datastore? https://github.com/googleapis/nodejs-datastore
28. touch controls
29. random stats when spawning 
30. strafing 
31. package as exe/etc with electron
32. add steam support
33. admin tool to interact with world
34. stay centered on selected characters
35. rightclick move the screen
36. change selected character stats
37. randomly spawn new characters
38. randomly move characters
39. character health ui