export const cleanRoom = (req, res) => {
    // Logic to clean a room
    res.status(200).send({ message: "Room cleaned successfully." });
};

export const markRoomAsCleaned = (req, res) => {
    // Logic to mark room as cleaned
    res.status(200).send({ message: "Room marked as cleaned." });
};
