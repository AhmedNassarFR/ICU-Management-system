export const updateCondition = (req, res) => {
    // Logic to update patient condition
    res.status(200).send({ message: "Condition updated successfully." });
};

export const viewDetails = (req, res) => {
    // Logic to view patient details
    res.status(200).send({ details: {} });
};

export const discharge = (req, res) => {
    // Logic to discharge a patient
    res.status(200).send({ message: "Patient discharged successfully." });
};
