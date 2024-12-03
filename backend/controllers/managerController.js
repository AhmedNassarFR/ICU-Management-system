export const registerICURooms = (req, res) => {
    // Logic to register ICU rooms
    res.status(201).send({ message: "ICU room registered successfully." });
};

export const assignTask = (req, res) => {
    // Logic to assign a task
    res.status(200).send({ message: "Task assigned successfully." });
};

export const addEmployee = (req, res) => {
    // Logic to add an employee
    res.status(201).send({ message: "Employee added successfully." });
};
