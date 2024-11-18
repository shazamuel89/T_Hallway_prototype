This project is meant to be a prototype of a very simple game engine.

The object rendered is a simple T-shaped hallway intersection.
I plan to eventually add a way to procedurally render a maze-like structure based on this and other similar objects.

The movement is done by the arrow keys, and instead of moving the camera, it moves the environment itself.
Left arrow moves the environment right, right arrow moves the environment left,
up arrow moves the environment towards the camera, and down arrow moves the environment away from the camera.
I plan to eventually add the ability to turn using the mouse movement, and possibly the ability to jump with the spacebar.

The view can be changed using the slider above the scene. This changes the field of view (FOV), and it can be changed from 10 to 120.

The light is positioned slightly below the ceiling, and is centered on the intersection between the perpendicular lines of the hallway.

The texture for the walls is meant to simulate old yellow wallpaper with a striped design.
I plan to eventually add textures for the ceiling and floor, and possibly bump maps for them as well.

To do:
- Change movement to work with WASD as well as arrow keys
- Add turning with mouse movement
- Add jumping ability with spacebar
- Add textures for ceiling and floor
- Add bump maps for ceiling and floor
- Add procedural generation of maze using T-hallway and other structures
