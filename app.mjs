import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

// app.get("/test", (req, res) => {
//   return res.json("Server API is working 🚀");
// });

app.post("/questions", async (req, res) => {
  const addNewQuestions = req.body;

  // console.log("Request Body:", addNewQuestions);

  try {
    const queryNewQuestion = `
      INSERT INTO questions (title, description, category) 
      VALUES ($1, $2, $3)
    `;

    const valuesAddNewQuestion = [
      addNewQuestions.title,
      addNewQuestions.description,
      addNewQuestions.category,
    ];

    // console.log("Values to Insert:", valuesAddNewQuestion);

    // รันคำสั่ง SQL
    await connectionPool.query(queryNewQuestion, valuesAddNewQuestion);

    // ส่ง response กลับเมื่อสร้างข้อมูลสำเร็จ
    return res.status(201).json({
      message: "Question created successfully",
    });
  } catch (error) {
    if (error.message === "Invalid data") {
      return res.status(400).json({ message: "Invalid request data" });
    } else {
      return res.status(500).json({ message: "Unable to create question." });
    }
  }
});

app.get("/questions", async (req, res) => {
  let displayAllQuestions;

  try {
    displayAllQuestions = await connectionPool.query("SELECT * FROM questions");
    return res.status(200).json({
      data: displayAllQuestions.rows,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

app.get("/questions/:questionId", async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const displayIdQuestion = await connectionPool.query(
      "SELECT * FROM questions WHERE id=$1",
      [questionId]
    );

    if (displayIdQuestion.rows.length === 0) {
      return res.status(404).json({
        message: `Question not found (question id: ${questionId})`,
      });
    }
    return res.status(200).json({
      data: displayIdQuestion.rows[0], // เอาแค่ id นั้นๆ
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Unable to fetch question.",
    });
  }
});

app.put("/questions/:questionId", async (req, res) => {
  const questionId = req.params.questionId;
  const updateQuestions = { ...req.body };

  try {
    const queryUpdateQuestions = `
      UPDATE questions 
      SET title = $1,
          description = $2,
          category = $3
      WHERE id = $4  
    `;
    /// where 4 =  id

    const valuesUpdateQuestion = [
      updateQuestions.title,
      updateQuestions.description,
      updateQuestions.category,
      questionId,
    ];

    const resultUpdate = await connectionPool.query(
      queryUpdateQuestions,
      valuesUpdateQuestion
    );

    if (resultUpdate.rowCount === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(201).json({
      message: "Question update successfully",
    });
  } catch (error) {
    if (error.message === "Invalid data") {
      return res.status(400).json({ message: "Invalid request data." });
    } else {
      return res.status(500).json({ message: "Unable to fetch questions." });
    }
  }
});

app.delete("/questions/:questionId", async (req, res) => {
  const questionId = req.params.questionId;

  try {
    const queryDeletedPost = `
      DELETE FROM questions
      WHERE id = $1
    `;
    const valuesDeletePost = [questionId];

    await connectionPool.query(queryDeletedPost, valuesDeletePost);

    return res.status(200).json({
      message: "Deleted post successfully",
    });
  } catch (error) {
  
    return res.status(500).json({
      message: "Could not delete post due to a server error",
    });
  }
});

// app.get("/questions/search"),async (req,res) => {
// const [title,category] = req.body;

// if (!title && !category) {
// return res.status(400).json ({
//   message: "Invalid search parameters.",
// })
// }

//// continue opotional and route 


// }


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
