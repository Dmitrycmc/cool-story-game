import express from "express";
import * as questionsService from "../../../services/questions-service";

const router = express.Router();

router.post("/:id", async (req, res, next) => {
    questionsService
        .getQuestions(req.params.id)
        .then((data) => res.json(data))
        .catch(next);
});

export default router;
