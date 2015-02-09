# RGB_GameOfLife
A javascript simulator inspired by Conway's Game of Life. This implementation is designed with internet independence in mind which is why it forgoes any server-side scripts.

This simulation utilizes the `<canvas>` element and some light jQuery to draw a pixel array as an image. It diverges from Conway's Game of Life in the following ways:

- The RGB channels are calculated separately each step via circumstantial increments
- Each pixel with a high or low enough R, G, or B value can increment or decrement its other values accordingly
- Each pixel gains an R, G, or B increment and decrement based on its value relative to its neighbors.
- Pixel cycling can invert a max or min value
- Mutation can cause a pixel's RGB values to shuffle
- Disease can cause a pixel to replace its R,G, or B value with an average of its neighbor's values.