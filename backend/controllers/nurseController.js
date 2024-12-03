export const setReport = (req, res) => {
    // Logic to set a report
    res.status(201).send({ message: "Report set successfully." });
};

export const viewSchedule = (req, res) => {
    // Logic to view schedule
    res.status(200).send({ schedule: [] });
};
