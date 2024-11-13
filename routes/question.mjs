import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionRouter = Router()


questionRouter.post("/", async (req, res) => {
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
  
  questionRouter.get("/", async (req, res) => {
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
  
  questionRouter.get("/search", async (req, res) => {
    const { title, category } = req.query;
  
    // ตรวจสอบว่าเป็น param query หรือไม่ 
    if (!title && !category) {
      return res.status(400).json({
        message: "Invalid search parameters.",
      });
    }
  
    try {
      let querySearch = "SELECT id, title, description, category FROM questions WHERE 1=1";
      const valuesSearch = []; // ใช้สำหรับเก็บค่าของ querySearch 
  
      if (title) {
        querySearch += ` AND title LIKE $${valuesSearch.length + 1}`;
        valuesSearch.push(`%${title}%`);
      }
  
   //valuesSearch.length + 1 เพื่อเลี่ยงค่า array ที่ 0 เมื่อ SQL $1 แทนค่า ที่กำหนดใน array  เพราะ SQL พารามิเตอร์เริ่มต้นที่ $1, ไม่ใช่ $0
   // สามารถสลับที่ พารามิเตอร์ ได้ ใส่พร้อมกันสองอันได้ หรือ อันเดียวก็ได้ เพราะ กำหนดให้ valuesSearch.length + 1
  
      if (category) {
        querySearch += ` AND category LIKE $${valuesSearch.length + 1}`;
        valuesSearch.push(`%${category}%`);
      }
  
      const result = await connectionPool.query(querySearch, valuesSearch);
  
      return res.status(200).json({
        data: result.rows,
      });
    } catch (error) {
      console.error("Error fetching questions:", error);
      return res.status(500).json({
        message: "Unable to fetch questions.",
      });
    }
  });
  
  
  questionRouter.get("/:questionId", async (req, res) => {
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
  
  questionRouter.put("/:questionId", async (req, res) => {
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
  
  questionRouter.delete("/:questionId", async (req, res) => {
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

  export default questionRouter; 