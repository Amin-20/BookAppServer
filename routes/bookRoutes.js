const express=require("express");
const router = express.Router();

const bookController=require('./../controllers/bookController');

router.param("id",bookController.checkId);


router.route("/").get(bookController.getAll).post(bookController.checkBody,bookController.create);

router
  .route("/:id")
  .get(bookController.getById)
  .patch(bookController.checkBody,bookController.update)
  .delete(bookController.delete);


module.exports=router;