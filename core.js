function offsetToCube(col, row)
{
    let x = col - (row - (row % 2)) / 2;
    let z = row;
    let y = -x-z;
    return {x,y,z};
}
function cube_distance(a, b) //где а и б это обьекты Cube в хексах из общего массива. 
{
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
}